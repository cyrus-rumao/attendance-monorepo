import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useSubjectStore } from '../../subjects/stores/useSubjectStore';
import { useTimetableStore } from '../stores/useTimetableStore';
import { notify } from '../../../lib/utils';
import type { TimetableSlot } from '@attendance/schemas';
import type { Subject } from '@attendance/schemas';
import { DAYS } from '@attendance/schemas';
import type { Day } from '@attendance/schemas';
import { calculateEndTime, timeToMinutes } from '../../../lib/utils';
import SubjectsSidebar from '../../subjects/components/subjects-sidebar';
import TimetableGrid from '../components/timetable-grid';

const CreateTimetable: React.FC = () => {
  const { subjects, getSubjects } = useSubjectStore();
  const { timetable, getTimetable, saveTimetable, loading } = useTimetableStore();

  const [localTimetable, setLocalTimetable] = useState<Record<Day, TimetableSlot[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  const [draggedSubject, setDraggedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getSubjects();
    getTimetable();
  }, [getSubjects, getTimetable]);

  useEffect(() => {
    if (timetable) {
      const newLocal: Record<Day, TimetableSlot[]> = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      };
      DAYS.forEach((day) => {
        if (timetable[day]) {
          newLocal[day] = timetable[day];
        }
      });
      setLocalTimetable(newLocal);
    }
  }, [timetable]);

  const handleDragStart = (subject: Subject) => {
    setDraggedSubject(subject);
  };

  const handleDragEnd = () => {
    setDraggedSubject(null);
  };

  const handleDrop = (day: Day, time: string) => {
    if (!draggedSubject) return;

    // Calculate end time based on subject type
    const isLab = draggedSubject.type === 'lab';
    const endTime = calculateEndTime(time, isLab);

    // Check for ANY overlap with existing slots
    const daySlots = localTimetable[day] || [];
    const newStartMinutes = timeToMinutes(time);
    const newEndMinutes = timeToMinutes(endTime);

    const hasOverlap = daySlots.some((existingSlot) => {
      const existingStart = timeToMinutes(existingSlot.startTime);
      const existingEnd = timeToMinutes(existingSlot.endTime);

      // Check if the new slot overlaps with existing slot
      return (
        (newStartMinutes >= existingStart && newStartMinutes < existingEnd) ||
        (newEndMinutes > existingStart && newEndMinutes <= existingEnd) ||
        (newStartMinutes <= existingStart && newEndMinutes >= existingEnd)
      );
    });

    if (hasOverlap) {
      notify.error('This time slot overlaps with an existing class');
      setDraggedSubject(null);
      return;
    }

    const newSlot: TimetableSlot = {
      subjectId: draggedSubject, // We will convert to ID string when saving
      startTime: time,
      endTime: endTime,
    };

    setLocalTimetable((prev) => ({
      ...prev,
      [day]: [...prev[day], newSlot],
    }));

    setDraggedSubject(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveSlot = (day: Day, slot: TimetableSlot) => {
    setLocalTimetable((prev) => ({
      ...prev,
      [day]: prev[day].filter(
        (s) =>
          s.startTime !== slot.startTime ||
          s.endTime !== slot.endTime ||
          s.subjectId._id !== slot.subjectId._id,
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const formattedTimetable: any = {};

      DAYS.forEach((day) => {
        formattedTimetable[day] = localTimetable[day].map((slot) => ({
          subjectId: typeof slot.subjectId === 'string' ? slot.subjectId : slot.subjectId._id,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));
      });
      console.log('Formatted Timetable: ', formattedTimetable);
      await saveTimetable(formattedTimetable);
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Create Timetable</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Timetable'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="flex gap-6">
          {/* Subjects Sidebar */}
          <SubjectsSidebar
            subjects={subjects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />

          {/* Timetable Grid */}
          <TimetableGrid
            timetable={localTimetable}
            mode="create"
            draggedSubject={draggedSubject}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onRemoveSlot={handleRemoveSlot}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTimetable;
