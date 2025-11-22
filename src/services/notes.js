import { Note } from '../db/models/Note.js';
import { SORT_ORDER } from '../constants/index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import mongoose from 'mongoose';

export const getAllNotes = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const query = filter;

  console.log('Final Mongo query:', JSON.stringify(query, null, 2));

  const notesQuery = Note.find(query);
  const notesCount = await Note.countDocuments(query);

  const notes = await notesQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(notesCount, perPage, page);

  return {
    data: notes,
    ...paginationData,
  };
};

export const getNoteById = async (noteId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) return null;

  const note = await Note.findOne({
    _id: noteId,
    user: userId,
  });
  console.log('Fetched note:', note);
  return note;
};

export const createNote = async (noteData, userId) => {
  const note = await Note.create({
    ...noteData,
    user: userId,
  });
  return note;
};

export const patchNote = async (noteId, updateData, userId) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return note;
};

export const deleteNote = async (noteId, userId) => {
  return Note.findOneAndDelete({ _id: noteId, user: userId });
};
