import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = models.users || model('users', usersSchema);
