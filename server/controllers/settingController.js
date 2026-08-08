import Setting from '../models/Setting.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get portfolio settings (seeding defaults if empty)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = await Setting.create({
        theme: 'dark',
        aiAssistantPrompt: 'You are the AI Assistant for Madanraj. Emphasize his MERN and AI skills.',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          leetcode: 'https://leetcode.com',
          codechef: 'https://codechef.com',
          gfg: 'https://geeksforgeeks.org',
          email: 'your_email@gmail.com',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update portfolio settings (Admin only)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = new Setting();
    }

    const parseField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    const fields = [
      'theme', 'aiAssistantPrompt', 'websiteTitle', 'websiteDescription',
      'logo', 'favicon', 'themeColors', 'fonts', 'sectionVisibility',
      'homeHero', 'aboutMe', 'contactDetails', 'socialLinks',
      'footerText', 'copyrightText'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = parseField(req.body[field]);
      }
    });

    // Support direct file uploads for brand assets
    if (req.files) {
      if (req.files.logoFile && req.files.logoFile[0]) {
        settings.logo = await uploadImage(req.files.logoFile[0], 'branding');
      }
      if (req.files.faviconFile && req.files.faviconFile[0]) {
        settings.favicon = await uploadImage(req.files.faviconFile[0], 'branding');
      }
      if (req.files.profileImageFile && req.files.profileImageFile[0]) {
        const uploadedAvatarUrl = await uploadImage(req.files.profileImageFile[0], 'branding');
        if (!settings.homeHero) settings.homeHero = {};
        settings.homeHero = {
          ...settings.homeHero,
          profileImage: uploadedAvatarUrl
        };
      }
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Upload resume file (Admin only)
export const uploadResumeFile = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = await Setting.create({});
    }

    if (req.file) {
      // If old CV exists, remove it
      if (settings.resumeUrl) {
        await deleteImage(settings.resumeUrl);
      }
      // Note: we can use uploadImage since it supports buffer uploads
      settings.resumeUrl = await uploadImage(req.file, 'resumes');
      await settings.save();
    } else {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: settings.resumeUrl,
    });
  } catch (error) {
    next(error);
  }
};
