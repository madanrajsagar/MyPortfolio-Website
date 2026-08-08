import Experience from '../models/Experience.js';

// Get all experiences sorted by start date descending
export const getAllExperiences = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    const experiences = await Experience.find(query).sort({ order: 1, startDate: -1 });
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    return field.split('\n').map(item => item.trim()).filter(Boolean);
  }
  return [field];
};

// Create an experience
export const createExperience = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.description = parseArrayField(data.description);
    data.techStack = parseArrayField(data.techStack);
    data.isCurrent = data.isCurrent === 'true' || data.isCurrent === true;

    const experience = await Experience.create(data);
    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// Update an experience
export const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.description) data.description = parseArrayField(data.description);
    if (data.techStack) data.techStack = parseArrayField(data.techStack);
    if (data.isCurrent !== undefined) {
      data.isCurrent = data.isCurrent === 'true' || data.isCurrent === true;
    }

    const experience = await Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an experience (Soft Delete)
export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    experience.status = 'deleted';
    experience.deletedAt = new Date();
    await experience.save();

    res.status(200).json({
      success: true,
      message: 'Experience moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
