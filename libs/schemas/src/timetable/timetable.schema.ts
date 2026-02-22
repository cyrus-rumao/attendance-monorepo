import { z } from 'zod';
import { SubjectSchema } from '../subject/subject.schema';

export const TimetableSlotSchema = z.object({
  subjectId: SubjectSchema, // populated subject
  startTime: z.string(), // HH:mm
  endTime: z.string(),
});

export const TimetableSaveSlotSchema = z.object({
  subjectId: z.string(), // ← string for saving
  startTime: z.string(),
  endTime: z.string(),
});

export const TimetableSaveSchema = z.object({
  monday: z.array(TimetableSaveSlotSchema).optional(),
  tuesday: z.array(TimetableSaveSlotSchema).optional(),
  wednesday: z.array(TimetableSaveSlotSchema).optional(),
  thursday: z.array(TimetableSaveSlotSchema).optional(),
  friday: z.array(TimetableSaveSlotSchema).optional(),
  saturday: z.array(TimetableSaveSlotSchema).optional(),
  sunday: z.array(TimetableSaveSlotSchema).optional(),
});

export const DaySchema = z.array(TimetableSlotSchema);

export const TimetableSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
  monday: DaySchema.default([]),
  tuesday: DaySchema.default([]),
  wednesday: DaySchema.default([]),
  thursday: DaySchema.default([]),
  friday: DaySchema.default([]),
  saturday: DaySchema.default([]),
});

// export type Subject = z.infer<typeof SubjectSchema>;
export type TimetableSave = z.infer<typeof TimetableSaveSchema>;

export type TimetableSlot = z.infer<typeof TimetableSlotSchema>;
export type Timetable = z.infer<typeof TimetableSchema>;

export const abcd = 9;
