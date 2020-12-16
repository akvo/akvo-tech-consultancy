export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = process.env.NODE_ENV !== "development"
    ? window.location.origin + "/" + process.env.REACT_APP_API_URL + "/"
    : process.env.REACT_APP_API_URL + "/"
export const CACHE_URL = window.location.href.split('/').splice(-1)[0].split('-').length === 1 ? false : true;
export const PARENT_URL = window.location !== window.parent.location;
export const USING_PASSWORDS = "2scale";
export const SAVE_FEATURES = [
    {
        instance:"2scale",
        api: false,
        pushApi: false,
        skipPassword: false,
        formEndpoint: true,
        skipMandatories: false
    },
    {
        instance:"idh",
        save: true,
        api: "gisco-pilot.tc.akvo.org/api",
        formEndpoint: false,
        skipPassword: true,
        skipMandatories: ["111510043", "113130042", "105640815","111890828","134210832"],
    },
];

export const CAPTCHA_KEY = process.env.REACT_APP_CAPTCHA_KEY;
export const READ_CACHE = process.env.NODE_ENV === "development" ? "fetch" : "update";
