const NODE_COLORS = [
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#14b8a6',
  '#eab308',
  '#ec4899',
  '#6366f1',
];

export const getNodeColor = (nodeName) => {
  const hash = [...nodeName].reduce(
    (value, character) => character.charCodeAt(0) + ((value << 5) - value),
    0
  );

  return NODE_COLORS[Math.abs(hash) % NODE_COLORS.length];
};
