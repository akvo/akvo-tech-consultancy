import Dhis from './custom/dhis.js';
import Sible from './custom/sible.js';
import WpUganda from './custom/wpuganda.js';

export const custom = (data) => {
  return {
    dhis: new Dhis(data),
    sible: new Sible(data),
    wpuganda: new WpUganda(data),
  };
}