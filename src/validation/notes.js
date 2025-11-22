import Joi from 'joi';

export const addNoteSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(1).required(),
  tag: Joi.string().optional(),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(1).optional(),
  tag: Joi.string().optional(),
}).min(1);
