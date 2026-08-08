import Education from '../models/Education.js';

// Get all education records sorted by start date descending
export const getAllEducation = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    const education = await Education.find(query).sort({ order: 1, startDate: -1 });
    res.status(200).json({
      success: true,
      count: education.length,
      data: education,
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

// Create education record
export const createEducation = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.certificates = parseArrayField(data.certificates);
    data.achievements = parseArrayField(data.achievements);

    const education = await Education.create(data);
    res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// Update education record
export const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.certificates) data.certificates = parseArrayField(data.certificates);
    if (data.achievements) data.achievements = parseArrayField(data.achievements);

    const education = await Education.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// Delete education record (Soft Delete)
export const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
      });
    }

    education.status = 'deleted';
    education.deletedAt = new Date();
    await education.save();

    res.status(200).json({
      success: true,
      message: 'Education record moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
