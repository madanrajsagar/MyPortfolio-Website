import mongoose from 'mongoose';

// Map resource string parameters to Mongoose models
const getModel = (resourceName) => {
  const models = {
    projects: mongoose.model('Project'),
    blogs: mongoose.model('Blog'),
    skills: mongoose.model('Skill'),
    achievements: mongoose.model('Achievement'),
    experiences: mongoose.model('Experience'),
    educations: mongoose.model('Education'),
    certificates: mongoose.model('Certificate'),
    gallery: mongoose.model('GalleryItem'),
  };
  return models[resourceName.toLowerCase()];
};

// GET Recycle Bin items for a specific resource
export const getRecycleBin = async (req, res, next) => {
  try {
    const { resource } = req.params;
    const Model = getModel(resource);
    if (!Model) {
      return res.status(404).json({ success: false, message: 'Resource model not found' });
    }

    const items = await Model.find({ status: 'deleted' }).sort({ deletedAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// PUT Restore a soft-deleted item
export const restoreItem = async (req, res, next) => {
  try {
    const { resource, id } = req.params;
    const Model = getModel(resource);
    if (!Model) {
      return res.status(404).json({ success: false, message: 'Resource model not found' });
    }

    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.status = 'draft'; // Default restored items to draft
    item.deletedAt = null;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item restored successfully (status set to draft)',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// POST Duplicate an existing item
export const duplicateItem = async (req, res, next) => {
  try {
    const { resource, id } = req.params;
    const Model = getModel(resource);
    if (!Model) {
      return res.status(404).json({ success: false, message: 'Resource model not found' });
    }

    const original = await Model.findById(id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Original item not found' });
    }

    const duplicateData = original.toObject();
    delete duplicateData._id;
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    // Append copy title tags
    if (duplicateData.title) duplicateData.title = `${duplicateData.title} (Copy)`;
    if (duplicateData.name) duplicateData.name = `${duplicateData.name} (Copy)`;
    
    // Modify slug to prevent conflicts
    if (duplicateData.slug) {
      duplicateData.slug = `${duplicateData.slug}-copy-${Date.now()}`;
    }

    const duplicate = new Model(duplicateData);
    await duplicate.save();

    res.status(201).json({
      success: true,
      message: 'Item duplicated successfully',
      data: duplicate,
    });
  } catch (error) {
    next(error);
  }
};

// POST Handle bulk operations (delete, restore, publish, draft, permanent-delete)
export const handleBulkAction = async (req, res, next) => {
  try {
    const { resource } = req.params;
    const { ids, action } = req.body;
    const Model = getModel(resource);
    if (!Model) {
      return res.status(404).json({ success: false, message: 'Resource model not found' });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No item IDs provided' });
    }

    let result;
    if (action === 'delete') {
      result = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { status: 'deleted', deletedAt: new Date() } }
      );
    } else if (action === 'restore') {
      result = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { status: 'draft', deletedAt: null } }
      );
    } else if (action === 'draft') {
      result = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { status: 'draft' } }
      );
    } else if (action === 'publish') {
      result = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { status: 'published' } }
      );
    } else if (action === 'permanent-delete') {
      // Note: This does not delete linked media from Cloudinary (handled individually or through media cleanup logs)
      result = await Model.deleteMany({ _id: { $in: ids } });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid bulk action type' });
    }

    res.status(200).json({
      success: true,
      message: `Bulk action '${action}' completed successfully`,
      count: result.modifiedCount || result.deletedCount || 0,
    });
  } catch (error) {
    next(error);
  }
};

// PUT Reorder list of items
export const reorderItems = async (req, res, next) => {
  try {
    const { resource } = req.params;
    const { orders } = req.body; // Array of { id, order }
    const Model = getModel(resource);
    if (!Model) {
      return res.status(404).json({ success: false, message: 'Resource model not found' });
    }

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid orders format' });
    }

    const promises = orders.map(item =>
      Model.findByIdAndUpdate(item.id, { $set: { order: item.order } }, { new: true })
    );
    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: 'Items reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
