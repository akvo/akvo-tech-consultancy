import { UserProvider, useUser } from "./user-context";

const useLocale = () => {
    const { locale, setLocale } = useUser();

    const update = data => {
        setLocale(data);
    };
    
    return { locale, update };
}

const langs = {
    en: 'English',
    de: 'German',
}

const questionnaire = {
    "111510043": {
        en: "Projects - GISCO",
        de: "Projects - GISCO",
    },
    "113130042": {
        en: "B - Industry",
        de: "B - Industrie",
    },
    "105640815": {
        en: "C - Retail",
        de: "C - Lebensmittelhandel",
    },
    "111890828": {
        en: "D - Civil Society (NGOs)",
        de: "D - Zivilgesellschaft (NROs)",
    },
    "134210832": {
        en: "D - Standard setting organisations",
        de: "D - Standardsetzende Organisationen",
    },
    //
    "143215090": {
        en: "Projects - Beyond Chocolate",
        de: "Projects - Beyond Chocolate",
    },
    "130990814": {
        en: "B - Industry - Beyond Chocolate",
        de: "B - Industrie - Beyond Chocolate",
    },
    "143340791": {
        en: "C - Retail - Beyond Chocolate",
        de: "C - Lebensmittelhandel - Beyond Chocolate",
    },
    "150700609": {
        en: "D - Civil Society (NGOs) - Beyond Chocolate",
        de: "D - Zivilgesellschaft (NROs) - Beyond Chocolate",
    },
    "148430590": {
        en: "D - Standard setting organisations - Beyond Chocolate",
        de: "D - Standardsetzende Organisationen - Beyond Chocolate",
    },
    "105320142": {
        en: "Survey Tests Example Survey",
        de: "Survey Tests Example Survey",
    },
}

export { useLocale, langs, questionnaire }
