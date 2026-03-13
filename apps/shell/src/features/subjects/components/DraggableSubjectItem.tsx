import React from 'react';
import type { Subject } from '@attendance/schemas';
import { BookOpen, FlaskConical } from 'lucide-react';

interface DraggableSubjectItemProps {
  subject: Subject;
  onDragStart: (subject: Subject) => void;
  onDragEnd: () => void;
}

const DraggableSubjectItem: React.FC<DraggableSubjectItemProps> = ({
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
      className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:border-amber-500/50 cursor-grab active:cursor-grabbing transition"
    >
    
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isLab ? 'bg-purple-500' : 'bg-amber-500'}`} />
        <div>
          <p className="text-sm font-medium text-white">{subject.name}</p>
          
        </div>
      </div>

 
      <div
        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
          isLab
            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}
      >
        {isLab ? <FlaskConical className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
        {subject.type.toUpperCase()}
      </div>
    </div>
  );
};

export default DraggableSubjectItem;
