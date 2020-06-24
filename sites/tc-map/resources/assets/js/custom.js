import Dhis from './custom/dhis.js';

export const custom = (data) => {
  return {
    dhis: new Dhis(data),
  };
}