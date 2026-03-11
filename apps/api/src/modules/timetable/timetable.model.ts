import mongoose, { Schema } from 'mongoose';

/* ---------------- TYPES ---------------- */

export interface ITimetableSlot {
  subjectId: mongoose.Types.ObjectId;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
}

export interface ITimetable {
  userId: mongoose.Types.ObjectId;
  monday: ITimetableSlot[];
  tuesday: ITimetableSlot[];
  wednesday: ITimetableSlot[];
  thursday: ITimetableSlot[];
  friday: ITimetableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- SCHEMAS ---------------- */

const slotSchema = new Schema<ITimetableSlot>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
  },
  { _id: false },
);

const timetableSchema = new Schema<ITimetable>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    monday: { type: [slotSchema], default: [] },
    tuesday: { type: [slotSchema], default: [] },
    wednesday: { type: [slotSchema], default: [] },
    thursday: { type: [slotSchema], default: [] },
    friday: { type: [slotSchema], default: [] },
  },
  { timestamps: true },
);
// timetableSchema.index({ userId: 1 }, { unique: true });
/* ---------------- MODEL ---------------- */

const Timetable = mongoose.model<ITimetable>('Timetable', timetableSchema);

export default Timetable;
