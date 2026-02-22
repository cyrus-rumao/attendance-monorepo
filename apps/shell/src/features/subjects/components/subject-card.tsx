import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Subject } from '@attendance/schemas';
import { motion } from 'framer-motion';
import { BookOpen, Edit, FlaskConical, Trash2 } from 'lucide-react';
import { useSubjectStore } from '../stores/useSubjectStore';
import ActionConfirmationModal from '../../../shared/components/action-confirmation';

interface SubjectCardProps {
  subject: Subject;
}

interface EditFormData {
  name: string;
  code: string;
  type: 'lecture' | 'lab';
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const isLab = subject.type === 'lab';
  const navigate = useNavigate();
  const { deleteSubject, updateSubject, loading } = useSubjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'delete' | 'edit'>('delete');

  const handleDeleteClick = () => {
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    setModalAction('edit');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async (editData?: EditFormData) => {
    if (modalAction === 'delete') {
      await deleteSubject(subject._id);
    } else if (modalAction === 'edit' && editData) {
      await updateSubject(subject._id, editData);
    }
  };

  return (
    <>
      <ActionConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        action={modalAction}
        subjectName={subject.name}
        subjectCode={subject.code}
        subjectType={subject.type}
        loading={loading}
      />

      <motion.div
        whileHover={{ y: -4 }}
        className="group relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl border ${
                isLab
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-amber-500/10 border-amber-500/20'
              }`}
            >
              {isLab ? (
                <FlaskConical className="w-6 h-6 text-purple-500" />
              ) : (
                <BookOpen className="w-6 h-6 text-amber-500" />
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLab
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {subject.type.toUpperCase()}
            </span>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
              {subject.name}
            </h3>
            <p className="text-zinc-500 text-sm font-mono">{subject.code}</p>
          </div>

          {/* Placeholder for attendance stats - you can add this later */}
          <div className="mb-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-500">Attendance</span>
              <span className="text-sm font-medium text-amber-400">--</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"
                style={{ width: '0%' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/subjects/${subject._id}`)}
              className="flex-1 px-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition text-sm font-medium"
            >
              View Details
            </button>
            <button
              onClick={handleEditClick}
              className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SubjectCard;
