import React from 'react';
import { Hash } from 'lucide-react';
import { Tag } from '../types/Note';
import TagBadge from './TagBadge';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagSelect }) => {
  if (tags.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <Hash className="h-4 w-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">Filter by Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.name} className="relative">
            <TagBadge
              tag={`${tag.name} (${tag.count})`}
              onClick={() => onTagSelect(tag.name)}
            />
            {selectedTags.includes(tag.name) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;