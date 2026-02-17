import React from 'react';
import type { TimetableSlot } from '../schemas/timetable.schema';
import type { Subject } from '../schemas/subject.schema';
import { DAYS, TIME_SLOTS } from '../schemas/constants';
import type { Day } from '../schemas/constants';
import { getSlotAtTime, isFirstSlotOfClass, calculateRowSpan } from '../lib/utils';
import TimetableCell from './timetable-cell';

interface TimetableGridProps {
	timetable: Record<Day, TimetableSlot[]>;
	draggedSubject: Subject | null;
	onDrop: (day: Day, time: string) => void;
	onDragOver: (e: React.DragEvent) => void;
	onRemoveSlot: (day: Day, slot: TimetableSlot) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
	timetable,
	draggedSubject,
	onDrop,
	onDragOver,
	onRemoveSlot,
}) => {
	return (
		<div className="flex-1 overflow-x-auto">
			<div
				className="inline-grid min-w-full"
				style={{
					gridTemplateColumns: '100px repeat(6, minmax(140px, 1fr))',
					gridTemplateRows: `60px repeat(${TIME_SLOTS.length}, 50px)`,
				}}>
				{/* Header - Days */}
				<div className="sticky left-0 z-30 bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex items-center justify-center">
					<span className="text-xs text-zinc-500 font-medium">TIME</span>
				</div>

				{DAYS.map((day) => (
					<div
						key={day}
						className="bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex items-center justify-center">
						<span className="text-sm font-medium text-amber-400 capitalize">
							{day}
						</span>
					</div>
				))}

				{/* Time labels and grid cells */}
				{TIME_SLOTS.map((time, timeIndex) => {
					return (
						<React.Fragment key={time}>
							{/* Time label - show for ALL slots */}
							<div
								className="sticky left-0 z-20 bg-zinc-950 border border-zinc-800 flex items-center justify-center"
								style={{ gridRow: timeIndex + 2 }}>
								<span className="text-xs text-zinc-400">{time}</span>
							</div>

							{/* Day cells */}
							{DAYS.map((day, dayIndex) => {
								const slot = getSlotAtTime(timetable, day, time);
								const shouldHide = slot && !isFirstSlotOfClass(day, time, slot);

								// Skip rendering if this cell is part of a merged cell above
								if (shouldHide) return null;

								const rowSpan = slot
									? calculateRowSpan(slot.startTime, slot.endTime)
									: 1;

								return (
									<TimetableCell
										key={`${day}-${time}`}
										day={day}
										time={time}
										slot={slot}
										rowSpan={rowSpan}
										dayIndex={dayIndex}
										timeIndex={timeIndex}
										draggedSubject={draggedSubject}
										onDrop={onDrop}
										onDragOver={onDragOver}
										onRemoveSlot={onRemoveSlot}
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
