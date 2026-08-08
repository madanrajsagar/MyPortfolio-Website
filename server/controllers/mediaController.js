import Media from '../models/Media.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';
import path from 'path';

// GET list of all media items with pagination and query filters
export const getAllMedia = async (req, res, next) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.filename = { $regex: search, $options: 'i' };
    }

    if (type && ['image', 'video', 'pdf'].includes(type)) {
      query.mediaType = type;
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skipIndex);

    const totalCount = await Media.countDocuments(query);

    res.status(200).json({
      success: true,
      count: media.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalCount,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// POST Upload a new file to the Media Library
export const uploadMediaFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Determine media category
    let mediaType = 'image';
    if (req.file.mimetype === 'application/pdf') {
      mediaType = 'pdf';
    } else if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    }

    // Upload to Cloudinary / Local disk via our service
    const url = await uploadImage(req.file, 'media_library');

    const newMedia = new Media({
      filename: req.file.originalname,
      url,
      mediaType,
      sizeBytes: req.file.size,
      uploadedBy: req.user?.id,
    });

    await newMedia.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded and cataloged successfully',
      data: {
        ...newMedia.toObject(),
        url,
        mediaUrl: url,
        fileName: req.file.originalname,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Remove a file from the Media Library
export const deleteMediaFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Media.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    // Delete asset from Cloudinary (or local disk if fell back)
    await deleteImage(item.url);

    // Delete database model
    await Media.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully from CDN and Database',
    });
  } catch (error) {
    next(error);
  }
};
