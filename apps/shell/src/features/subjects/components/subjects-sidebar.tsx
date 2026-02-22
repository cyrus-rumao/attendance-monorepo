import React from 'react';
import type { Subject } from '@attendance/schemas';
import DraggableSubjectItem from './DraggableSubjectItem';

interface SubjectsSidebarProps {
  subjects: Subject[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onDragStart: (subject: Subject) => void;
  onDragEnd: () => void;
}

const SubjectsSidebar: React.FC<SubjectsSidebarProps> = ({
  subjects,
  searchQuery,
  setSearchQuery,
  onDragStart,
  onDragEnd,
}) => {
  const filteredSubjects = subjects.filter((subject) => {
    const query = searchQuery.toLowerCase();
    return subject.name.toLowerCase().includes(query) || subject.code.toLowerCase().includes(query);
  });

  return (
    <div className="w-80 shrink-0">
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 sticky top-32">
        <h2 className="text-xl font-medium text-white mb-4">Subjects</h2>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {filteredSubjects.map((subject) => (
            <DraggableSubjectItem
              key={subject._id}
              subject={subject}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
          {filteredSubjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No subjects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectsSidebar;
