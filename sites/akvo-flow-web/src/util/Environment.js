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
        formEndpoint: true
    },
    {
        instance:"seap",
        api: "gisco-demo.tc.akvo.org/api",
        formEndpoint: false
    },
    {
        instance:"idh",
        api: "gisco-demo.tc.akvo.org/api",
        formEndpoint: false
    },
];

export const CAPTCHA_KEY = process.env.REACT_APP_CAPTCHA_KEY;
export const READ_CACHE = process.env.NODE_ENV === "development" ? "fetch" : "update";
