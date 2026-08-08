import Skill from '../models/Skill.js';

// Get all skills sorted by order
export const getAllSkills = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    const skills = await Skill.find(query).sort({ order: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// Create a skill
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// Update a skill
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a skill (Soft Delete)
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    skill.status = 'deleted';
    skill.deletedAt = new Date();
    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Skill moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update skills (e.g. for reordering)
export const bulkUpdateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body; // Array of { id, order }

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of skill updates',
      });
    }

    const updates = skills.map(skill =>
      Skill.findByIdAndUpdate(skill.id || skill._id, { order: skill.order }, { new: true })
    );

    await Promise.all(updates);

    const updatedSkills = await Skill.find({}).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: 'Skills reordered successfully',
      data: updatedSkills,
    });
  } catch (error) {
    next(error);
  }
};
