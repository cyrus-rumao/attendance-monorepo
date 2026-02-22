import type { TimetableSlot } from '@attendance/schemas';
import type { Day } from '@attendance/schemas';
import { toast } from 'sonner';
type ToastMessage = string;

export const notify = {
  success: (msg: ToastMessage) => toast.success(msg, { position: 'top-center', duration: 5000 }),

  error: (msg: ToastMessage) => toast.error(msg, { position: 'top-center', duration: 5000 }),
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const calculateRowSpan = (startTime: string, endTime: string): number => {
  return (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60; // 30-minute slots
};

export const getSlotAtTime = (
  timetable: Record<Day, TimetableSlot[]>,
  day: Day,
  time: string,
): TimetableSlot | null => {
  const slots = timetable[day] || [];
  return (
    slots.find((slot) => {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      const currentTime = timeToMinutes(time);
      return slotStart <= currentTime && slotEnd > currentTime;
    }) || null
  );
};

export const isFirstSlotOfClass = (day: Day, time: string, slot: TimetableSlot): boolean => {
  return timeToMinutes(slot.startTime) === timeToMinutes(time);
};

export const calculateEndTime = (startTime: string, isLab: boolean): string => {
  const duration = isLab ? 2 : 1; // Labs are 2 hours, lectures are 1 hour
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration * 60;
  return minutesToTime(endMinutes);
};
