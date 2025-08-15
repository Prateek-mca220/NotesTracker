export const TAG_COLORS = [
  'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'bg-green-100 text-green-800 hover:bg-green-200',
  'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'bg-pink-100 text-pink-800 hover:bg-pink-200',
  'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  'bg-red-100 text-red-800 hover:bg-red-200',
  'bg-teal-100 text-teal-800 hover:bg-teal-200',
];

export const getTagColor = (tag: string): string => {
  const hash = tag.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
};