import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company/Organization name is required'],
      trim: true,
    },
    companyFull: {
      type: String,
      trim: true,
      default: '',  // e.g. "GDG On Campus — Walchand College of Engineering"
    },
    role: {
      type: String,
      required: [true, 'Role/Position is required'],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    description: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    highlights: [
      {
        // Stored as "{icon}|{text}" — icon is a string name, split on render
        type: String,
        trim: true,
      },
    ],
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: 'indigo',  // matches colorConfig keys in Experience.jsx
    },
    type: {
      type: String,
      required: [true, 'Experience type is required'],
      enum: ['job', 'volunteer', 'leadership', 'Leadership', 'Volunteer'],
      default: 'job',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
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

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
