import Dhis from './custom/dhis.js';
import Sible from './custom/sible.js';

export const custom = (data) => {
  return {
    dhis: new Dhis(data),
    sible: new Sible(data),
  };
}