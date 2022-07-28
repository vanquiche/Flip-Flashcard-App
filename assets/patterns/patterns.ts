const DEFAULT_PATTERNS: Record<string, any> = {
  honeycomb: require('./honeycomb.png'),
  checker: require('./checker.png'),
};

export const STORE_PATTERNS: Record<string, any> = {
  uroko: require('./uroko.png'),
  chevron: require('./chevron.png'),
  herringbone: require('./herringbone.png'),
  inkblob: require('./inkblob.png'),
  clouds: require('./japanese-clouds.png'),
  leaves: require('./leaves.png'),
  waves: require('./waves.png'),
};

export const PRELOAD_PATTERNS = Object.values(DEFAULT_PATTERNS).concat(
  Object.values(STORE_PATTERNS)
);

export default DEFAULT_PATTERNS;
