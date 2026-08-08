import GalleryItem from '../models/GalleryItem.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// Get all gallery items sorted by date descending
export const getAllGalleryItems = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    if (category) {
      query.category = category;
    }

    const items = await GalleryItem.find(query).sort({ order: 1, date: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// Create a gallery item
export const createGalleryItem = async (req, res, next) => {
  try {
    const itemData = { ...req.body };

    if (req.file) {
      itemData.mediaUrl = await uploadImage(req.file, 'gallery');
      itemData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    } else if (!itemData.mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Media file or URL is required',
      });
    }

    const galleryItem = await GalleryItem.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a gallery item (Soft Delete)
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    // Soft delete
    item.status = 'deleted';
    item.deletedAt = new Date();
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Gallery item moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
