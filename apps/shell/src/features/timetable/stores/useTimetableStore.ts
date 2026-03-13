import { create } from 'zustand';
import { AxiosError } from 'axios';
import axios from '../../../lib/axios';
import { notify } from '../../../lib/utils';
import { z } from 'zod';
import {
  TimetableSaveSchema,
  TimetableSchema,
  TimetableSlotSchema,
  type Timetable,
  type TimetableSave,
  type TimetableSlot,
} from '@attendance/schemas';

interface TimetableStore {
  timetable: Timetable | null;
  loading: boolean;

  getTimetable: () => Promise<Timetable | null>;
  saveTimetable: (timetableData: TimetableSave) => Promise<boolean>;

  deleteTimetable: () => Promise<boolean>;
  updateDay: (day: keyof Timetable, slots: TimetableSlot[]) => void;
  resetTimetable: () => void;
}

export const useTimetableStore = create<TimetableStore>((set, get) => ({
  timetable: null,
  loading: false,

  getTimetable: async () => {
    set({ loading: true });

    try {
      const res = await axios.get('/timetable');

      const parsed = TimetableSchema.parse(res.data);

      set({ timetable: parsed, loading: false });
      return parsed;
    } catch (error: unknown) {
      set({ timetable: null, loading: false });

      const err = error as AxiosError;
      if (err.response?.status === 404) {
        console.log("No timetable found for user, starting with empty timetable");
      }
      return null;
    }
  },

  saveTimetable: async (timetableData) => {
    set({ loading: true });

    try {
      console.log(timetableData);
      const validated = TimetableSaveSchema.parse(timetableData);
      console.log('Validated Timetable: ', validated);
      const res = await axios.post('/timetable', validated);

      const parsed = TimetableSchema.parse(res.data);

      set({ timetable: parsed, loading: false });
      notify.success('Timetable saved');
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.log('Erorr', error);
      notify.error(err.response?.data?.message || 'Failed to save timetable');
      set({ loading: false });
      return false;
    }
  },

  deleteTimetable: async () => {
    set({ loading: true });

    try {
      await axios.delete('/timetable');
      set({ timetable: null, loading: false });
      notify.success('Timetable deleted');
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      notify.error(err.response?.data?.message || 'Failed to delete timetable');
      set({ loading: false });
      return false;
    }
  },

  updateDay: (day, slots) => {
    const timetable = get().timetable;
    if (!timetable) return;

    const parsedSlots = z.array(TimetableSlotSchema).safeParse(slots);
    if (!parsedSlots.success) {
      notify.error('Invalid timetable slot data');
      return;
    }

    set({
      timetable: {
        ...timetable,
        [day]: parsedSlots.data,
      },
    });
  },

  // ---------- RESET ----------
  resetTimetable: () => {
    set({ timetable: null });
  },
}));
