import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Star, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { TermSection } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditTermsModalProps {
  section: TermSection | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTermsModal: React.FC<EditTermsModalProps> = ({
  section,
  isOpen,
  onClose,
}) => {
  const { addTermSection, updateTermSection } = useApp();
  const isEditing = !!section;

  const [title, setTitle] = useState(section?.title || '');
  const [points, setPoints] = useState<string[]>(section?.points || []);
  const [newPoint, setNewPoint] = useState('');

  // Drag state for points
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setPoints(section.points);
    } else {
      setTitle('');
      setPoints([]);
    }
  }, [section, isOpen]);

  if (!isOpen) return null;

  const handleAddPoint = () => {
    if (newPoint.trim()) {
      setPoints([...points, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const handleRemovePoint = (index: number) => {
    setPoints(points.filter((_, idx) => idx !== index));
  };

  const handleMovePoint = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= points.length) return;
    setPoints((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIdx, 1);
      result.splice(toIdx, 0, removed);
      return result;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && section) {
      updateTermSection(section.id, {
        title: title.trim(),
        points,
      });
    } else {
      addTermSection({
        title: title.trim(),
        points,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-bold text-[#eab308] tracking-[0.2em] uppercase">
            {isEditing ? 'EDIT TERMS SECTION' : 'NEW TERMS SECTION'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isEditing ? `Edit Policy Section` : 'Add Terms & Conditions Section'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage policy rules, drag & drop to reorder clauses above or below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1. Booking & Deposit Policy"
              className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider mb-2">
              Bullet Points & Policies ({points.length}) • Drag or Reorder
            </label>

            {/* List of current points with drag & reorder */}
            <div className="space-y-2 mb-3">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => setDraggedPointIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedPointIndex !== null && draggedPointIndex !== idx) {
                      handleMovePoint(draggedPointIndex, idx);
                    }
                    setDraggedPointIndex(null);
                  }}
                  className="flex items-center justify-between gap-2 p-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs text-white"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="text-gray-500 hover:text-[#eab308] cursor-grab active:cursor-grabbing p-0.5"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                    <Star className="w-3 h-3 text-[#eab308] fill-[#eab308] shrink-0" />
                    <span className="truncate">{p}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMovePoint(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePoint(idx, idx + 1)}
                      disabled={idx === points.length - 1}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(idx)}
                      className="text-gray-400 hover:text-red-400 p-1 shrink-0 cursor-pointer"
                      title="Delete point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new point input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPoint();
                  }
                }}
                placeholder="Enter policy clause or guideline..."
                className="flex-1 bg-[#181818] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#eab308]"
              />
              <button
                type="button"
                onClick={handleAddPoint}
                className="bg-[#2a2a2a] hover:bg-[#383838] border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#eab308]" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs py-2.5 px-6 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Section' : 'Create Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
