import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Rich fields for the portfolio UI
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'Full Stack',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    projectStatus: {
      // Separate from the publish status field below
      type: String,
      enum: ['Completed', 'Live', 'In Progress', 'Archived'],
      default: 'Completed',
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    // Problem / Solution / Contribution
    problem: {
      type: String,
      trim: true,
      default: '',
    },
    solution: {
      type: String,
      trim: true,
      default: '',
    },
    contribution: {
      type: String,
      trim: true,
      default: '',
    },
    // Images
    heroImage: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    // Technical detail arrays
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    architecture: [
      {
        type: String,
        trim: true,
      },
    ],
    challenges: {
      type: String,
      trim: true,
    },
    learnings: {
      type: String,
      trim: true,
    },
    // Links
    githubLink: {
      type: String,
      trim: true,
    },
    liveDemo: {
      type: String,
      trim: true,
    },
    // Metadata
    timeline: {
      type: String,
      trim: true,
    },
    impact: {
      type: String,
      trim: true,
    },
    futureImprovements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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

// Create slug auto-generator before validation
projectSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
