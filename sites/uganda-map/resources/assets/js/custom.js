import Dhis from './custom/dhis.js';
import Sible from './custom/sible.js';
import WpUganda from './custom/wpuganda.js';
import StUganda from './custom/stuganda.js';

export const custom = (data) => {
  return {
    dhis: new Dhis(data),
    sible: new Sible(data),
    wpuganda: new WpUganda(data),
    stuganda: new StUganda(data),
  };
}