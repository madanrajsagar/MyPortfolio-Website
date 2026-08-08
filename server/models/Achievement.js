import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true,
    },
    // Rich fields matching the portfolio UI
    position: {
      type: String,  // e.g. "🥈 1st Runner-Up"
      trim: true,
      default: '',
    },
    positionLabel: {
      type: String,  // e.g. "2nd Place (₹15,000 Prize)"
      trim: true,
      default: '',
    },
    badge: {
      type: String,
      enum: ['gold', 'silver', 'bronze', 'platinum'],
      default: 'gold',
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    contribution: {
      type: String,
      trim: true,
      default: '',
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    certificateUrl: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String,  // Cloudinary URLs
      },
    ],
    eventDetails: {
      type: String,
      trim: true,
    },
    date: {
      type: String,   // Changed from Date to String — supports "2024" or "2020 – 2023"
      required: [true, 'Achievement date is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'deleted'],
      default: 'published',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
