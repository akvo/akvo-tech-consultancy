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
}

export { useLocale, langs, questionnaire }