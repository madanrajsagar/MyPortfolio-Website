import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Highlight title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: 'Star',
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: 'text-indigo-400',
    },
    bg: {
      type: String,
      default: 'bg-indigo-500/10',
    },
    border: {
      type: String,
      default: 'border-indigo-500/20',
    },
    glow: {
      type: String,
      default: 'shadow-indigo-500/10',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'deleted'],
      default: 'published',
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

const Highlight = mongoose.model('Highlight', highlightSchema);
export default Highlight;
