import WpUganda from './custom/wpuganda.js';
import StUganda from './custom/stuganda.js';
import SigWashCovid from './custom/sigwashcovid.js';

export const custom = (data) => {
  return {
    wpuganda: new WpUganda(data),
    stuganda: new StUganda(data),
    sigwashcovid: new SigWashCovid(data),
  };
}