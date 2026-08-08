import Navigation from '../models/Navigation.js';

// GET all menu links
export const getNavigationLinks = async (req, res, next) => {
  try {
    const { all } = req.query; // 'all=true' query shows hidden elements for admin
    const filter = {};
    
    if (all !== 'true') {
      filter.visible = true;
    }

    const links = await Navigation.find(filter).sort({ order: 1 });
    res.status(200).json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
};

// POST Create a new menu link
export const createNavigationLink = async (req, res, next) => {
  try {
    const { label, path, order, visible } = req.body;
    
    if (!label || !path) {
      return res.status(400).json({ success: false, message: 'Label and Path are required' });
    }

    const newLink = new Navigation({
      label,
      path,
      order: order || 0,
      visible: visible !== undefined ? visible : true,
    });

    await newLink.save();

    res.status(201).json({
      success: true,
      message: 'Navigation link created successfully',
      data: newLink,
    });
  } catch (error) {
    next(error);
  }
};

// PUT Update navigation link details
export const updateNavigationLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, path, order, visible } = req.body;

    const link = await Navigation.findById(id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Navigation link not found' });
    }

    if (label !== undefined) link.label = label;
    if (path !== undefined) link.path = path;
    if (order !== undefined) link.order = order;
    if (visible !== undefined) link.visible = visible;

    await link.save();

    res.status(200).json({
      success: true,
      message: 'Navigation link updated successfully',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Remove navigation link
export const deleteNavigationLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const link = await Navigation.findById(id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Navigation link not found' });
    }

    await Navigation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Navigation link deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// PUT Batch update order of links
export const batchReorderLinks = async (req, res, next) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid orders parameters' });
    }

    const promises = orders.map(item => 
      Navigation.findByIdAndUpdate(item.id, { $set: { order: item.order } }, { new: true })
    );
    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: 'Navigation reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
