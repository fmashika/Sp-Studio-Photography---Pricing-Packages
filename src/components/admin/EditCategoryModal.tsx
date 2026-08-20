import React, { useState, useEffect } from 'react';
import { X, Save, FolderPlus, Trash2 } from 'lucide-react';
import { AppCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditCategoryModalProps {
  category: AppCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const { addCategory, updateCategory } = useApp();
  const isEditing = !!category;

  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<'packages' | 'terms'>(category?.type || 'packages');
  const [badge, setBadge] = useState(category?.badge || '');
  const [description, setDescription] = useState(category?.description || '');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setBadge(category.badge || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setType('packages');
      setBadge('');
      setDescription('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && category) {
      updateCategory(category.id, {
        name: name.trim(),
        type,
        badge: badge.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        badge: badge.trim() || undefined,
        description: description.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
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
            {isEditing ? 'EDIT CATEGORY' : 'NEW CATEGORY / PAGE'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isEditing ? `Edit ${category?.name}` : 'Create New Category'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Categories appear as navigation tabs on the public website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              Category Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Corporate Events, Send Off Packages"
              className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1.5">
                Page Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308] cursor-pointer"
              >
                <option value="packages">📦 Pricing Packages List</option>
                <option value="terms">📜 Terms & Guidelines Page</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5">
                Badge / Pill (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. NEW, POPULAR"
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              Short Description / Subtitle
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief overview of what this category offers..."
              rows={2}
              className="w-full bg-[#181818] border border-white/20 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#eab308]"
            />
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
              <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
