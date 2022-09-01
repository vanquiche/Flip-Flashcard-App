import { PRELOAD_PATTERNS } from "./patterns/patterns";

// add images to here to be preloaded
const images = [
  require('./adaptive-icon.png'),
  require('./images/profile-user.png'),
  require('./images/walkthrough-slide_001.png'),
  require('./images/walkthrough-slide_002.png'),
  require('./images/walkthrough-slide_003.png'),
  require('./images/walkthrough-slide_004.png'),
  require('./images/walkthrough-slide_005.png'),
  require('./images/walkthrough-slide_006.png'),
  require('./images/walkthrough-slide_007.png'),
  require('./images/walkthrough-slide_008.png'),
  require('./images/walkthrough-slide_009.png'),
  require('./images/walkthrough-slide_010.png'),
  require('./images/HeartCoinImage.png')
]

const PRELOAD_IMAGES = images.concat(PRELOAD_PATTERNS)

export default PRELOAD_IMAGES