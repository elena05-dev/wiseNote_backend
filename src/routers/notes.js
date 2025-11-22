import { Router } from 'express';
import {
  getNotesController,
  getNoteByIdController,
  createNoteController,
  patchNoteController,
  deleteNoteController,
} from '../controllers/notes.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { addNoteSchema, updateNoteSchema } from '../validation/notes.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getNotesController));
router.get('/:noteId', isValidId, ctrlWrapper(getNoteByIdController));
router.post(
  '/',
  validateBody(addNoteSchema),
  ctrlWrapper(createNoteController),
);

router.patch(
  '/:noteId',
  isValidId,
  validateBody(updateNoteSchema),
  ctrlWrapper(patchNoteController),
);

router.delete('/:noteId', isValidId, ctrlWrapper(deleteNoteController));

export default router;
