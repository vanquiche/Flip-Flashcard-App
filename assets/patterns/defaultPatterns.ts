
const DEFAULT_PATTERNS: Record<string, any> = {
  default: null,
  pattern: require('./pattern.png'),
  heart: require('./heart.png'),
  checker: require('./square-pattern.png'),
};

export const STORE_PATTERNS: Record<string, any> = {
  floor: require('./floor.png'),
  circleOutline: require('./circle-outline.png'),
  dots: require('./dots.png')
};

export const PRELOAD_IMGS = [
    require('./pattern.png'),
    require('./heart.png'),
    require('./square-pattern.png'),
    require('./floor.png'),
    require('./circle-outline.png'),
    require('./dots.png'),
  ];

export default DEFAULT_PATTERNS;

