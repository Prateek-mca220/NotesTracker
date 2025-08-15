import React from 'react';
import { X } from 'lucide-react';
import { getTagColor } from '../utils/tagColors';

interface TagBadgeProps {
  tag: string;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, removable = false, onClick, onRemove }) => {
  const colorClass = getTagColor(tag);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${colorClass}`}
      onClick={onClick}
    >
      {tag}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;