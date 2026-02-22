import mongoose, { Schema, Document, Model, Query } from 'mongoose';
import Attendance from '../attendance/attendance.model';
/* ---------------- TYPES ---------------- */

export type SubjectType = 'lecture' | 'lab';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  code?: string;
  type: SubjectType;
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- SCHEMA ---------------- */
const subjectSchema = new Schema<ISubject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ['lecture', 'lab'],
      default: 'lecture',
    },
  },
  { timestamps: true },
);

subjectSchema.pre('validate', function (this: ISubject) {
  if (this.name) {
    this.name = this.name.trim().toUpperCase();
  }
});

subjectSchema.pre<Query<ISubject, ISubject>>('findOneAndUpdate', function () {
  const update = this.getUpdate() as any;

  if (update?.name) {
    update.name = update.name.trim().toUpperCase();
    this.setUpdate(update);
  }
});

subjectSchema.pre('findOneAndDelete', async function () {
  const subject = await this.model.findOne(this.getFilter());

  if (subject) {
    await Attendance.deleteMany({
      subjectId: subject._id,
    });
  }
});

subjectSchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

/* ---------------- MODEL ---------------- */

const Subject: Model<ISubject> = mongoose.model<ISubject>('Subject', subjectSchema);

export default Subject;
