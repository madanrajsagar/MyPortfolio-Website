import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      // Expanded to support all categories used in the UI
      enum: [
        'Programming Languages',
        'Frontend Development',
        'Backend Development',
        'Database Technologies',
        'Artificial Intelligence & Machine Learning',
        'DevOps & Cloud',
        'Tools & Platforms',
        'Data Visualization',
        // Aliases used by the frontend default data
        'Frontend',
        'Backend',
        'Databases',
        'AI & Machine Learning',
        'Cloud',
        'DevOps',
        'Tools',
        'Core Computer Science',
        'Soft Skills',
      ],
    },
    icon: {
      type: String,
      default: '',  // Lucide or React Icon name
    },
    emoji: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'indigo',  // Tailwind color name, e.g. 'violet', 'sky', 'emerald'
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    projectsUsedIn: [
      {
        type: String,
        trim: true,
      },
    ],
    proficiency: {
      type: Number,
      required: [true, 'Proficiency (0-100) is required'],
      min: 0,
      max: 100,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    order: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
