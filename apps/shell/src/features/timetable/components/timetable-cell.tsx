import React from 'react';
import {  X } from 'lucide-react';
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
  mode: 'create' | 'view';

  draggedSubject?: Subject | null;
  onDrop?: (day: Day, time: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onRemoveSlot?: (day: Day, slot: TimetableSlot) => void;
  onSlotClick?: (slot: TimetableSlot) => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  time,
  slot,
  rowSpan,
  dayIndex,
  timeIndex,
  mode,
  draggedSubject,
  onDrop,
  onDragOver,
  onRemoveSlot,
  onSlotClick,
}) => {
  // ================= EMPTY CELL =================
  if (!slot) {
    if (mode === 'view') {
      return (
        <div
          className="border border-zinc-800 bg-zinc-950/30"
          style={{
            gridColumn: dayIndex + 2,
            gridRow: timeIndex + 2,
          }}
        />
      );
    }

    // Create mode: droppable
    return (
      <div
        onDrop={() => onDrop?.(day, time)}
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

  // ================= CLASS SLOT =================
  const isLab = slot.subjectId.type === 'lab';

  return (
    <div
      onClick={mode === 'view' ? () => onSlotClick?.(slot) : undefined}
      className={`border-2 border-zinc-800 p-3 group relative ${
        isLab
          ? 'bg-purple-500/10 hover:bg-purple-500/20 border-l-4 border-purple-500'
          : 'bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-500'
      } ${mode === 'view' ? 'cursor-pointer' : ''}`}
      style={{
        gridColumn: dayIndex + 2,
        gridRow: `${timeIndex + 2} / span ${rowSpan}`,
      }}
    >
      {/* Delete button only in create mode */}
      {mode === 'create' && (
        <button
          onClick={() => onRemoveSlot?.(day, slot)}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-500/20 hover:text-red-400"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col h-full justify-center">
          

          <h3 className="font-medium text-white text-[10px] leading-snug   heloo line-clamp-2">
            {slot.subjectId.name}
          </h3>
        

        <div className="text-[10px] text-zinc-500">
          {slot.startTime} - {slot.endTime}
        </div>
      </div>
    </div>
  );
};

export default TimetableCell;
