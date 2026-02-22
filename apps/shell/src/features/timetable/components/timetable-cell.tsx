import React from 'react';
import { BookOpen, FlaskConical, X } from 'lucide-react';
import type { TimetableSlot } from '@attendance/schemas';
import type { Subject } from '@attendance/schemas';
import type { Day } from '@attendance/schemas';

interface TimetableCellProps {
  day: Day;
  time: string;
  slot: TimetableSlot | null;
  rowSpan: number;
  dayIndex: number;
  timeIndex: number;
  draggedSubject: Subject | null;
  onDrop: (day: Day, time: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemoveSlot: (day: Day, slot: TimetableSlot) => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  time,
  slot,
  rowSpan,
  dayIndex,
  timeIndex,
  draggedSubject,
  onDrop,
  onDragOver,
  onRemoveSlot,
}) => {
  if (!slot) {
    // Empty cell - droppable
    return (
      <div
        onDrop={() => onDrop(day, time)}
        onDragOver={onDragOver}
        className={`border border-zinc-800 bg-zinc-950/30 hover:bg-zinc-900/50 transition ${
          draggedSubject ? 'hover:border-amber-500/50' : ''
        }`}
        style={{
          gridColumn: dayIndex + 2,
          gridRow: timeIndex + 2,
        }}
      >
        <div className="h-full flex items-center justify-center">
          {draggedSubject && <span className="text-xs text-zinc-600">Drop here</span>}
        </div>
      </div>
    );
  }

  // Class slot
  const isLab = slot.subjectId.type === 'lab';

  return (
    <div
      className={`border-2 border-zinc-800 p-3 group relative ${
        isLab
          ? 'bg-purple-500/10 hover:bg-purple-500/20 border-l-4 border-purple-500'
          : 'bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-500'
      }`}
      style={{
        gridColumn: dayIndex + 2,
        gridRow: `${timeIndex + 2} / span ${rowSpan}`,
      }}
    >
      {/* Delete button */}
      <button
        onClick={() => onRemoveSlot(day, slot)}
        className="absolute top-2 right-2 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-500/20 hover:text-red-400"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Content */}
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-start gap-2 mb-1">
          {isLab ? (
            <FlaskConical className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          ) : (
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <h3 className="font-medium text-white text-sm leading-tight line-clamp-2">
            {slot.subjectId.code}
          </h3>
        </div>
        <div className="text-xs text-zinc-500">
          {slot.startTime} - {slot.endTime}
        </div>
      </div>
    </div>
  );
};

export default TimetableCell;
