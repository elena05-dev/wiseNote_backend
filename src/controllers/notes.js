import {
  getAllNotes,
  getNoteById,
  createNote,
  patchNote,
  deleteNote,
} from '../services/notes.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getNotesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const filter = parseFilterParams(req.query, req.user._id);
    console.log('filter before getAllNotes:', JSON.stringify(filter, null, 2));

    const {
      data: notes,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    } = await getAllNotes({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found notes!',
      data: {
        data: notes,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteByIdController = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await getNoteById(noteId, req.user._id);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found note with id ${noteId}!`,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const createNoteController = async (req, res, next) => {
  try {
    const note = await createNote(req.body, req.user._id);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a note!',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const patchNoteController = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await patchNote(noteId, req.body, req.user._id);

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a note!',
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNoteController = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await deleteNote(noteId, req.user._id);

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
