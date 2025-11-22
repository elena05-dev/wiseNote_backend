import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { noteId } = req.params;

  if (!isValidObjectId(noteId)) {
    return next(createHttpError(400, `Invalid note ID format: ${noteId}`));
  }

  next();
};
