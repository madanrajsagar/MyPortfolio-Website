import Highlight from '../models/Highlight.js';

// Get all highlights
export const getAllHighlights = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    const highlights = await Highlight.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (error) {
    next(error);
  }
};

// Create a highlight
export const createHighlight = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const highlight = await Highlight.create(data);

    res.status(201).json({
      success: true,
      message: 'Highlight created successfully',
      data: highlight,
    });
  } catch (error) {
    next(error);
  }
};

// Update a highlight
export const updateHighlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    let highlight = await Highlight.findById(id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: 'Highlight not found',
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    highlight = await Highlight.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Highlight updated successfully',
      data: highlight,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a highlight (soft delete)
export const deleteHighlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const highlight = await Highlight.findById(id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: 'Highlight not found',
      });
    }

    highlight.status = 'deleted';
    await highlight.save();

    res.status(200).json({
      success: true,
      message: 'Highlight deleted successfully (soft delete)',
      data: highlight,
    });
  } catch (error) {
    next(error);
  }
};
