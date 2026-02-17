import React from 'react';
import { BookOpen, FlaskConical, GripVertical } from 'lucide-react';
import type { Subject } from '../schemas/subject.schema';

interface SubjectCardProps {
	subject: Subject;
	onDragStart: (subject: Subject) => void;
	onDragEnd: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
	subject,
	onDragStart,
	onDragEnd,
}) => {
	const isLab = subject.type === 'lab';

	return (
		<div
			draggable
			onDragStart={() => onDragStart(subject)}
			onDragEnd={onDragEnd}
			className={`p-3 rounded-lg border-2 cursor-move transition hover:scale-105 ${
				isLab
					? 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500'
					: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500'
			}`}>
			<div className="flex items-start gap-2">
				<GripVertical className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
				<div className="flex-1 min-w-0">
					<div className="flex items-start gap-2">
						{isLab ? (
							<FlaskConical className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
						) : (
							<BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
						)}
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-medium text-white truncate">
								{subject.name}
							</h3>
							<p className="text-xs text-zinc-500 mt-0.5">{subject.code}</p>
							<div className="flex items-center gap-2 mt-1">
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										isLab
											? 'bg-purple-500/20 text-purple-400'
											: 'bg-amber-500/20 text-amber-400'
									}`}>
									{isLab ? '2 hours' : '1 hour'}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										isLab
											? 'bg-purple-500/20 text-purple-400'
											: 'bg-amber-500/20 text-amber-400'
									}`}>
									{subject.type.toUpperCase()}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubjectCard;
