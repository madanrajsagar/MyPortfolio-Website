import Project from '../models/Project.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// Get all projects with filtering and search
export const getAllProjects = async (req, res, next) => {
  try {
    const { search, featured, tech, admin } = req.query;
    const query = {};

    // For admin view, display drafts/archives (not deleted). For public, only published items.
    if (admin === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } },
      ];
    }

    if (tech) {
      query.techStack = { $in: [new RegExp(tech, 'i')] };
    }

    const projects = await Project.find(query).sort({ order: 1, featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// Get single project by slug and increment views
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Parse request fields that might be JSON arrays
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [field];
  } catch (e) {
    // If it's a comma separated string
    if (typeof field === 'string') {
      return field.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [field];
  }
};

// Create a new project
export const createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };

    // Process array fields
    projectData.techStack = parseArrayField(projectData.techStack);
    projectData.features = parseArrayField(projectData.features);
    projectData.architecture = parseArrayField(projectData.architecture);
    projectData.futureImprovements = parseArrayField(projectData.futureImprovements);
    projectData.featured = projectData.featured === 'true' || projectData.featured === true;

    // Handle hero image upload
    if (req.files && req.files.heroImage && req.files.heroImage[0]) {
      projectData.heroImage = await uploadImage(req.files.heroImage[0], 'projects');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Hero image is required for creating a project',
      });
    }

    // Handle gallery uploads
    projectData.gallery = [];
    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        const imageUrl = await uploadImage(file, 'projects/gallery');
        projectData.gallery.push(imageUrl);
      }
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Update a project
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const updateData = { ...req.body };

    // Process array fields
    if (updateData.techStack) updateData.techStack = parseArrayField(updateData.techStack);
    if (updateData.features) updateData.features = parseArrayField(updateData.features);
    if (updateData.architecture) updateData.architecture = parseArrayField(updateData.architecture);
    if (updateData.futureImprovements) updateData.futureImprovements = parseArrayField(updateData.futureImprovements);
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    // Handle hero image update
    if (req.files && req.files.heroImage && req.files.heroImage[0]) {
      // Delete old hero image
      await deleteImage(project.heroImage);
      updateData.heroImage = await uploadImage(req.files.heroImage[0], 'projects');
    }

    // Handle gallery updates & existing array retention
    let currentGallery = [];
    if (updateData.gallery !== undefined) {
      currentGallery = parseArrayField(updateData.gallery);
    } else {
      currentGallery = project.gallery || [];
    }

    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        const imageUrl = await uploadImage(file, 'projects/gallery');
        currentGallery.push(imageUrl);
      }
    }
    updateData.gallery = currentGallery;

    // Support removing a specific gallery image by its URL
    if (req.body.removeGalleryImage) {
      const imageToDelete = req.body.removeGalleryImage;
      await deleteImage(imageToDelete);
      updateData.gallery = project.gallery.filter(img => img !== imageToDelete);
    }

    project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a project (Soft Delete)
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Soft delete
    project.status = 'deleted';
    project.deletedAt = new Date();
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
