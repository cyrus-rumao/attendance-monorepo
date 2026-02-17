import { create } from 'zustand';
import axios from '../lib/axios';
import { notify } from '../lib/utils';
import {
	SubjectSchema,
	type Subject,
	type AddSubjectInput,
} from '../schemas/subject.schema';
import {
	SubjectDetailSchema,
	type SubjectDetail,
} from '../schemas/subject.schema';

interface UpdateSubjectData {
	name?: string;
	code?: string;
	type?: 'lecture' | 'lab';
}

interface SubjectState {
	subjects: Subject[];
	selectedSubject: SubjectDetail | null;
	loading: boolean;

	getSubjects: () => Promise<void>;
	addSubject: (subject: AddSubjectInput) => Promise<void>;
	getSubjectAnalytics: (id: string) => Promise<void>;
	deleteSubject: (id: string) => Promise<void>;
	updateSubject: (subjectId: string, data: UpdateSubjectData) => Promise<void>;
	clearSelectedSubject: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
	subjects: [],
	selectedSubject: null,
	loading: false,

	/* ---------------- GET ALL SUBJECTS ---------------- */

	getSubjects: async () => {
		try {
			set({ loading: true });

			const res = await axios.get('/subjects');

			const parsed = res.data.map((s: unknown) => SubjectSchema.parse(s));

			set({
				subjects: parsed,
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to fetch subjects');
		}
	},

	/* ---------------- ADD SUBJECT ---------------- */

	addSubject: async (subject) => {
		try {
			set({ loading: true });

			const res = await axios.post('/subjects', subject);

			const parsed = SubjectSchema.parse(res.data);

			set({
				subjects: [...get().subjects, parsed],
				loading: false,
			});

			notify.success('Subject added successfully');
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to add subject');
		}
	},

	/* ---------------- GET SUBJECT ANALYTICS ---------------- */

	getSubjectAnalytics: async (id: string) => {
		try {
			set({ loading: true });

			const res = await axios.get(`/subjects/${id}`);

			const parsed = SubjectDetailSchema.parse(res.data);

			set({
				selectedSubject: parsed,
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to fetch subject details');
		}
	},

	deleteSubject: async (subjectId: string) => {
		try {
			set({ loading: true });

			// Send delete request - user is already authenticated via auth store
			// Backend should verify the user owns this subject via the auth cookie/token
			await axios.delete(`/subjects/${subjectId}`);

			// Remove from state
			set({
				subjects: get().subjects.filter((s) => s._id !== subjectId),
				loading: false,
			});

			notify.success('Subject and all records deleted successfully');
		} catch (error: any) {
			set({ loading: false });

			// Handle specific error cases
			if (error.response?.status === 403) {
				notify.error('You do not have permission to delete this subject');
			} else if (error.response?.status === 404) {
				notify.error('Subject not found');
			} else {
				notify.error(
					error.response?.data?.message || 'Failed to delete subject',
				);
			}
			throw error; // Re-throw to handle in component if needed
		}
	},
	/* ---------------- UPDATE SUBJECT ---------------- */

	updateSubject: async (subjectId: string, data: UpdateSubjectData) => {
		try {
			set({ loading: true });

			// Send update request - user is already authenticated via auth store
			const res = await axios.put<Subject>(`/subjects/${subjectId}`, data);

			// Update in state
			set({
				subjects: get().subjects.map((s) =>
					s._id === subjectId ? res.data : s,
				),
				loading: false,
			});

			notify.success('Subject updated successfully');
		} catch (error: any) {
			set({ loading: false });

			// Handle specific error cases
			if (error.response?.status === 403) {
				notify.error('You do not have permission to update this subject');
			} else if (error.response?.status === 404) {
				notify.error('Subject not found');
			} else if (error.response?.status === 400) {
				notify.error('Invalid subject data');
			} else {
				notify.error(
					error.response?.data?.message || 'Failed to update subject',
				);
			}
			throw error; // Re-throw to handle in component if needed
		}
	},

	/* ---------------- CLEAR ---------------- */

	clearSelectedSubject: () => {
		set({ selectedSubject: null });
	},
}));
