import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Star,
  Shield,
  Camera,
  Video,
  Crown,
  Sparkles,
  Heart,
  Gem,
  Flame,
  Award,
  Film,
  Tv,
  Aperture,
  Music,
  FolderPlus,
  Ban,
  AlertCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { PricingPackage, PackageFeatureSection, IconStyleType } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditPackageModalProps {
  pkg: PricingPackage | null;
  isOpen: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
}

const AVAILABLE_ICONS: { key: IconStyleType; label: string; icon: React.ReactNode }[] = [
  { key: 'none', label: 'No Icon (Clean)', icon: <Ban className="w-4 h-4 text-gray-400" /> },
  { key: 'star', label: 'Star', icon: <Star className="w-4 h-4 text-[#eab308]" /> },
  { key: 'shield', label: 'Shield', icon: <Shield className="w-4 h-4 text-[#eab308]" /> },
  { key: 'camera', label: 'Camera', icon: <Camera className="w-4 h-4 text-[#eab308]" /> },
  { key: 'video', label: 'Video Cinema', icon: <Video className="w-4 h-4 text-[#eab308]" /> },
  { key: 'crown', label: 'Royal Crown', icon: <Crown className="w-4 h-4 text-[#eab308]" /> },
  { key: 'sparkles', label: 'Sparkles', icon: <Sparkles className="w-4 h-4 text-[#eab308]" /> },
  { key: 'heart', label: 'Heart / Wedding', icon: <Heart className="w-4 h-4 text-[#eab308]" /> },
  { key: 'flame', label: 'Flame / Hot', icon: <Flame className="w-4 h-4 text-[#eab308]" /> },
  { key: 'gem', label: 'Diamond / Gem', icon: <Gem className="w-4 h-4 text-[#eab308]" /> },
  { key: 'award', label: 'Award Badge', icon: <Award className="w-4 h-4 text-[#eab308]" /> },
  { key: 'film', label: 'Film Reel', icon: <Film className="w-4 h-4 text-[#eab308]" /> },
  { key: 'tv', label: 'TV Screen', icon: <Tv className="w-4 h-4 text-[#eab308]" /> },
  { key: 'aperture', label: 'Lens Aperture', icon: <Aperture className="w-4 h-4 text-[#eab308]" /> },
  { key: 'music', label: 'Music Audio', icon: <Music className="w-4 h-4 text-[#eab308]" /> },
];

export const EditPackageModal: React.FC<EditPackageModalProps> = ({
  pkg,
  isOpen,
  onClose,
  defaultCategoryId = 'wedding',
}) => {
  const { updatePackage, addPackage, categories } = useApp();

  const isEditing = !!pkg;

  const [categoryId, setCategoryId] = useState<string>(pkg?.categoryId || defaultCategoryId);
  const [name, setName] = useState(pkg?.name || '');
  const [price, setPrice] = useState(pkg?.price || '');
  const [rawPrice, setRawPrice] = useState<number>(pkg?.rawPrice || 2000000);
  const [featured, setFeatured] = useState<boolean>(pkg?.featured || false);
  const [badge, setBadge] = useState(pkg?.badge || '');
  const [iconType, setIconType] = useState<IconStyleType | string>(pkg?.iconType || 'star');

  // Subtitle Sections with deep immutable state management & drag-and-drop
  const [sections, setSections] = useState<PackageFeatureSection[]>([]);
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [itemInputs, setItemInputs] = useState<{ [key: number]: string }>({});

  // Drag & drop state for sections
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);

  // Drag & drop state for items inside sections
  const [draggedItem, setDraggedItem] = useState<{ sectionIdx: number; itemIdx: number } | null>(null);

  useEffect(() => {
    if (pkg) {
      setCategoryId(pkg.categoryId || 'wedding');
      setName(pkg.name);
      setPrice(pkg.price);
      setRawPrice(pkg.rawPrice);
      setFeatured(pkg.featured || false);
      setBadge(pkg.badge || '');
      setIconType(pkg.iconType);
      if (pkg.sections && pkg.sections.length > 0) {
        setSections(JSON.parse(JSON.stringify(pkg.sections)));
      } else if (pkg.features && pkg.features.length > 0) {
        setSections([
          {
            subtitle: "What's Included:",
            items: [...pkg.features],
          },
        ]);
      } else {
        setSections([]);
      }
    } else {
      setCategoryId(defaultCategoryId);
      setName('NEW PRICING PACKAGE');
      setPrice('TZS 2,000,000/-');
      setRawPrice(2000000);
      setFeatured(false);
      setBadge('');
      setIconType('star');
      setSections([
        {
          subtitle: 'Video and Photo Coverage:',
          items: [
            'Full Coverage',
            'One Photographer & one Videographer Professionals',
            'Three 65 inches flat screen at the venue',
          ],
        },
        {
          subtitle: 'Deliverable Includes:',
          items: [
            'Video highlight',
            'Two A3 wooden Frames',
            'One A3 Photobook Professional designed',
            'One flash disk with all Photos & Videos',
            'Online gallery 200 high resolution images & 6 months access',
          ],
        },
      ]);
    }
  }, [pkg, isOpen, defaultCategoryId]);

  if (!isOpen) return null;

  // Add new section/subtitle
  const handleAddSection = () => {
    if (newSectionSubtitle.trim()) {
      setSections((prev) => [
        ...prev,
        {
          subtitle: newSectionSubtitle.trim(),
          items: [],
        },
      ]);
      setNewSectionSubtitle('');
    }
  };

  // Remove a section
  const handleRemoveSection = (sectionIndex: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
  };

  // Move Section Up/Down
  const handleMoveSection = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= sections.length) return;
    setSections((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIdx, 1);
      result.splice(toIdx, 0, removed);
      return result;
    });
  };

  // Section Drag & Drop Handlers
  const handleSectionDragStart = (idx: number) => {
    setDraggedSectionIndex(idx);
  };

  const handleSectionDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverSectionIndex(idx);
  };

  const handleSectionDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedSectionIndex !== null && draggedSectionIndex !== targetIdx) {
      handleMoveSection(draggedSectionIndex, targetIdx);
    }
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  // Update subtitle text
  const handleUpdateSubtitle = (sectionIndex: number, text: string) => {
    setSections((prev) =>
      prev.map((sec, idx) => (idx === sectionIndex ? { ...sec, subtitle: text } : sec))
    );
  };

  // Add item under section
  const handleAddItemToSection = (sectionIndex: number) => {
    const text = itemInputs[sectionIndex];
    if (text && text.trim()) {
      setSections((prev) =>
        prev.map((sec, idx) =>
          idx === sectionIndex
            ? { ...sec, items: [...sec.items, text.trim()] }
            : sec
        )
      );
      setItemInputs((prev) => ({ ...prev, [sectionIndex]: '' }));
    }
  };

  // Remove item from section
  const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
    setSections((prev) =>
      prev.map((sec, idx) =>
        idx === sectionIndex
          ? { ...sec, items: sec.items.filter((_, iIdx) => iIdx !== itemIndex) }
          : sec
      )
    );
  };

  // Move Item Up/Down within section
  const handleMoveItem = (sectionIndex: number, fromIdx: number, toIdx: number) => {
    setSections((prev) =>
      prev.map((sec, idx) => {
        if (idx !== sectionIndex) return sec;
        if (toIdx < 0 || toIdx >= sec.items.length) return sec;
        const newItems = [...sec.items];
        const [moved] = newItems.splice(fromIdx, 1);
        newItems.splice(toIdx, 0, moved);
        return { ...sec, items: newItems };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Flatten all items for backward compatibility
    const flatFeatures = sections.flatMap((s) => s.items);

    if (isEditing && pkg) {
      updatePackage(pkg.id, {
        categoryId,
        name,
        price,
        rawPrice: Number(rawPrice) || 0,
        featured,
        badge: badge.trim() || undefined,
        iconType,
        features: flatFeatures,
        sections: sections.length > 0 ? sections : undefined,
      });
    } else {
      addPackage({
        categoryId,
        name,
        price,
        rawPrice: Number(rawPrice) || 0,
        featured,
        badge: badge.trim() || undefined,
        iconType,
        features: flatFeatures,
        sections: sections.length > 0 ? sections : undefined,
        buttonLabel: 'Book Now',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
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
            {isEditing ? 'EDIT PACKAGE & SECTIONS' : 'CREATE NEW PACKAGE'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isEditing ? `Edit ${pkg?.name}` : 'Add New Pricing Package'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Customize package title, category, pricing, icons, and drag & drop sections above or below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#eab308] uppercase mb-1.5">
              Assign to Category / Page
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308] cursor-pointer"
            >
              {categories
                .filter((c) => c.type === 'packages')
                .map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#1a1a1a]">
                    📁 {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Main Package Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. STANDARD PACKAGE"
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Display Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. TZS 2,000,000/-"
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Raw Amount (for analytics)
              </label>
              <input
                type="number"
                value={rawPrice}
                onChange={(e) => setRawPrice(Number(e.target.value))}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Custom Badge / Pill (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. EXCLUSIVE / POPULAR"
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              />
            </div>
          </div>

          {/* Icon Style Selector with Visual Grid */}
          <div className="border-t border-white/10 pt-4">
            <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider mb-2.5">
              Icon Style (Select or Remove Icon)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-[#141414] border border-white/10 rounded-2xl">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = iconType === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setIconType(item.key)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#eab308]/20 border-[#eab308] text-white shadow-md'
                        : 'bg-[#1c1c1c] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="mb-1">{item.icon}</span>
                    <span className="truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#181818] border border-white/10 rounded-2xl">
            <input
              type="checkbox"
              id="featuredCheck"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-[#eab308] accent-[#eab308] cursor-pointer"
            />
            <label htmlFor="featuredCheck" className="text-xs font-semibold text-white cursor-pointer select-none">
              Highlight as Featured Package (Golden border & tag)
            </label>
          </div>

          {/* Subtitle & Included Feature Sections Editor with Drag & Drop */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider">
                FEATURE SECTIONS & SUBTITLES ({sections.length}) • DRAG & DROP ABOVE / BELOW
              </label>

              {sections.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSections([])}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold cursor-pointer"
                >
                  Delete All Sections
                </button>
              )}
            </div>

            {/* List of Subtitle Sections with Drag & Drop */}
            {sections.length === 0 ? (
              <div className="p-4 bg-[#141414] border border-dashed border-white/15 rounded-2xl text-center text-xs text-gray-400 mb-4">
                <AlertCircle className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <span>No sections currently created. Add a subtitle section below.</span>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {sections.map((sec, sIdx) => {
                  const isDragging = draggedSectionIndex === sIdx;
                  const isDragOver = dragOverSectionIndex === sIdx;

                  return (
                    <div
                      key={sIdx}
                      draggable
                      onDragStart={() => handleSectionDragStart(sIdx)}
                      onDragOver={(e) => handleSectionDragOver(e, sIdx)}
                      onDrop={(e) => handleSectionDrop(e, sIdx)}
                      className={`bg-[#141414] border rounded-2xl p-4 space-y-3 transition-all duration-200 ${
                        isDragOver
                          ? 'border-[#eab308] bg-[#1a170b] shadow-lg'
                          : isDragging
                          ? 'opacity-40 border-dashed border-[#eab308]'
                          : 'border-white/15 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          {/* Drag Handle & Reorder Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <div
                              className="p-1 text-gray-500 hover:text-[#eab308] cursor-grab active:cursor-grabbing"
                              title="Drag section above or below"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleMoveSection(sIdx, sIdx - 1)}
                                disabled={sIdx === 0}
                                className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move section up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveSection(sIdx, sIdx + 1)}
                                disabled={sIdx === sections.length - 1}
                                className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move section down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-[#eab308] uppercase tracking-wider mb-1">
                              Sub title:
                            </label>
                            <input
                              type="text"
                              value={sec.subtitle}
                              onChange={(e) => handleUpdateSubtitle(sIdx, e.target.value)}
                              placeholder="e.g. Video and Photo Coverage:"
                              className="w-full bg-[#1c1c1c] border border-[#eab308]/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-[#eab308]"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer mt-4 flex items-center gap-1 text-xs font-bold shrink-0"
                          title="Delete this section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>

                      {/* Star bullet list of items in this section with drag / reorder */}
                      <div className="space-y-1.5 pl-6">
                        {sec.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-center justify-between gap-2 p-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveItem(sIdx, iIdx, iIdx - 1)}
                                disabled={iIdx === 0}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move item up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveItem(sIdx, iIdx, iIdx + 1)}
                                disabled={iIdx === sec.items.length - 1}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move item down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(sIdx, iIdx)}
                                className="text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                                title="Delete item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add item to this section */}
                      <div className="flex gap-2 pt-1 pl-6">
                        <input
                          type="text"
                          value={itemInputs[sIdx] || ''}
                          onChange={(e) => setItemInputs({ ...itemInputs, [sIdx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddItemToSection(sIdx);
                            }
                          }}
                          placeholder="Add item under this subtitle..."
                          className="flex-1 bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddItemToSection(sIdx)}
                          className="bg-[#2a2a2a] hover:bg-[#383838] border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-[#eab308]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Section / Subtitle Form */}
            <div className="flex gap-2 p-3 bg-[#181818] border border-dashed border-[#eab308]/40 rounded-2xl items-center">
              <input
                type="text"
                value={newSectionSubtitle}
                onChange={(e) => setNewSectionSubtitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSection();
                  }
                }}
                placeholder="New section subtitle (e.g. Deliverable Includes:)..."
                className="flex-1 bg-[#121212] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#eab308]"
              />
              <button
                type="button"
                onClick={handleAddSection}
                className="bg-[#eab308] hover:bg-[#f59e0b] text-black font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add Subtitle Section</span>
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
              <span>{isEditing ? 'Save Package' : 'Create Package'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
