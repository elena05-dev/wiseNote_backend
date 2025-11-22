import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tag: {
      type: String,
      enum: ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      default: 'All',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UsersCollection',
      required: true,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
