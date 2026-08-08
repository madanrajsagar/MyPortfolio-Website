import Achievement from '../models/Achievement.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// Get all achievements
export const getAllAchievements = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    const achievements = await Achievement.find(query).sort({ order: 1, date: -1 });
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// Create an achievement
export const createAchievement = async (req, res, next) => {
  try {
    const achievementData = { ...req.body };

    // Process files
    achievementData.photos = [];
    if (req.files) {
      if (req.files.certificate) {
        achievementData.certificateUrl = await uploadImage(req.files.certificate[0], 'achievements/certificates');
      }
      if (req.files.photos) {
        for (const file of req.files.photos) {
          const url = await uploadImage(file, 'achievements/photos');
          achievementData.photos.push(url);
        }
      }
    }

    const achievement = await Achievement.create(achievementData);

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

// Update an achievement
export const updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    let achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    const updateData = { ...req.body };

    // Process files if uploaded
    if (req.files) {
      if (req.files.certificate && req.files.certificate[0]) {
        if (achievement.certificateUrl) {
          await deleteImage(achievement.certificateUrl);
        }
        updateData.certificateUrl = await uploadImage(req.files.certificate[0], 'achievements/certificates');
      }

    // Handle photos updates & existing array retention
    let currentPhotos = [];
    if (updateData.photos !== undefined) {
      if (Array.isArray(updateData.photos)) {
        currentPhotos = updateData.photos;
      } else if (typeof updateData.photos === 'string') {
        try {
          const parsed = JSON.parse(updateData.photos);
          currentPhotos = Array.isArray(parsed) ? parsed : [updateData.photos];
        } catch (e) {
          currentPhotos = updateData.photos.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    } else {
      currentPhotos = achievement.photos || [];
    }

    if (req.files && req.files.photos) {
      for (const file of req.files.photos) {
        const url = await uploadImage(file, 'achievements/photos');
        currentPhotos.push(url);
      }
    }
    updateData.photos = currentPhotos;
    }

    // Handle single photo deletion
    if (req.body.removePhoto) {
      const photoToDelete = req.body.removePhoto;
      await deleteImage(photoToDelete);
      updateData.photos = achievement.photos.filter(p => p !== photoToDelete);
    }

    achievement = await Achievement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an achievement (Soft Delete)
export const deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    // Soft delete
    achievement.status = 'deleted';
    achievement.deletedAt = new Date();
    await achievement.save();

    res.status(200).json({
      success: true,
      message: 'Achievement moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
