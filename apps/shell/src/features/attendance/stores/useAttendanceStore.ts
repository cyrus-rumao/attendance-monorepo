import { create } from 'zustand';
import { AxiosError } from 'axios';
import axios from '../../../lib/axios';
import { notify } from '../../../lib/utils';

export type AttendanceStatus = 'present' | 'absent' | 'bunked' | 'cancelled';

export interface AttendanceRecord {
	_id: string;
	subjectId: {
		_id: string;
		name: string;
		code: string;
		type: 'lecture' | 'lab';
	};
	date: string;
	startTime: string;
	endTime: string;
	hours: number;
	status: AttendanceStatus;
}

interface AttendanceStore {
	attendanceByDate: AttendanceRecord[];
	loading: boolean;

	getAttendanceByDate: (date: string) => Promise<void>;
	markAttendance: (data: {
		subjectId: string;
		date: string;
		startTime: string;
		endTime: string;
		status: AttendanceStatus;
	}) => Promise<boolean>;

	deleteAttendance: (id: string) => Promise<boolean>;
	resetAttendance: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendanceByDate: [],
  loading: false,

  // ---------- GET BY DATE ----------
  getAttendanceByDate: async (date) => {
    set({ loading: true });

    try {
      const res = await axios.get('/attendance', {
        params: { date },
      });

      set({
        attendanceByDate: res.data,
        loading: false,
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      notify.error(err.response?.data?.message || 'Failed to fetch attendance');
      set({ attendanceByDate: [], loading: false });
    }
  },

  // ---------- MARK ----------
  markAttendance: async (data) => {
    set({ loading: true });

    try {
      const res = await axios.post('/attendance', data);
      const newRecord = res.data;

      set((state) => {
        const filtered = state.attendanceByDate.filter(
          (a) =>
            !(
              a.subjectId._id === newRecord.subjectId._id &&
              a.date === newRecord.date &&
              a.startTime === newRecord.startTime &&
              a.endTime === newRecord.endTime
            ),
        );

        return {
          attendanceByDate: [...filtered, newRecord],
          loading: false,
        };
      });

      notify.success('Attendance marked');
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      notify.error(err.response?.data?.message || 'Failed to mark attendance');
      set({ loading: false });
      return false;
    }
  },

  // ---------- DELETE ----------
  deleteAttendance: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`/attendance/${id}`);

      set({
        attendanceByDate: get().attendanceByDate.filter((a) => a._id !== id),
        loading: false,
      });

      notify.success('Attendance deleted');
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      notify.error(err.response?.data?.message || 'Failed to delete attendance');
      set({ loading: false });
      return false;
    }
  },

  resetAttendance: () => {
    set({ attendanceByDate: [] });
  },
}));
