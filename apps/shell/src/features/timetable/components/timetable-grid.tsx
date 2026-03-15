import React from 'react';
import type { TimetableSlot } from '@attendance/schemas';
import type { Subject } from '@attendance/schemas';
import { DAYS, TIME_SLOTS } from '@attendance/schemas';
import type { Day } from '@attendance/schemas';
import { getSlotAtTime, isFirstSlotOfClass, calculateRowSpan } from '../../../lib/utils';
import TimetableCell from './timetable-cell';

interface TimetableGridProps {
  timetable: Record<Day, TimetableSlot[]>;
  mode: 'create' | 'view';

  draggedSubject?: Subject | null;
  onDrop?: (day: Day, time: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onRemoveSlot?: (day: Day, slot: TimetableSlot) => void;
  onSlotClick?: (slot: TimetableSlot) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetable,
  mode,
  draggedSubject,
  onDrop,
  onDragOver,
  onRemoveSlot,
  onSlotClick,
}) => {
  return (
    <div className="flex-1 overflow-x-auto">
      <div
        className="inline-grid min-w-full"
        style={{
          gridTemplateColumns: '100px repeat(6, minmax(140px, 1fr))',
          gridTemplateRows: `60px repeat(${TIME_SLOTS.length}, 50px)`,
        }}
      >
     
        <div className=" left-0 z-30 bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex items-center justify-center">
          <span className="text-xs text-zinc-500 font-medium">TIME</span>
        </div>

        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex items-center justify-center"
          >
            <span className="text-sm font-medium text-amber-400 capitalize">{day}</span>
          </div>
        ))}

      
        {TIME_SLOTS.map((time, timeIndex) => {
          return (
            <React.Fragment key={time}>
           
              <div
                className="left-0 z-20 bg-zinc-950 border border-zinc-800 flex items-center justify-center"
                style={{ gridRow: timeIndex + 2 }}
              >
                <span className="text-xs text-zinc-400">{time}</span>
              </div>

              {DAYS.map((day, dayIndex) => {
                const slot = getSlotAtTime(timetable, day, time);
                const shouldHide = slot && !isFirstSlotOfClass(day, time, slot);

              
                if (shouldHide) return null;

                const rowSpan = slot ? calculateRowSpan(slot.startTime, slot.endTime) : 1;

                return (
                  <TimetableCell
                    key={`${day}-${time}`}
                    day={day}
                    time={time}
                    slot={slot}
                    mode={mode}
                    rowSpan={rowSpan}
                    dayIndex={dayIndex}
                    timeIndex={timeIndex}
                    draggedSubject={mode === 'create' ? draggedSubject : null}
                    onDrop={mode === 'create' ? onDrop : undefined}
                    onDragOver={mode === 'create' ? onDragOver : undefined}
                    onRemoveSlot={mode === 'create' ? onRemoveSlot : undefined}
                    onSlotClick={mode === 'view' ? onSlotClick : undefined}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TimetableGrid;
