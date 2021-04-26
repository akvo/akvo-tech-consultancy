import { UserProvider, useUser } from "./user-context";

const useLocale = () => {
    const { locale, setLocale } = useUser();

    const update = data => {
        setLocale(data);
    };

    return { locale, update };
};

const langs = {
    en: "English",
    de: "German"
};

const questionnaire = {
    "120190025": {
        en: "Internal dev form",
        de: "interne Entwicklungsform"
    },
    "114380434": {
        en: "Master_Beyond Chocolate_Standard setting organisations",
        de: "Master_Beyond Chocolate_Standard setting organisations"
    },
  "122170164": {
        en: "Member_Beyond Chocolate_Industry",
        de: "Member_Beyond Chocolate_Industry"
    },
  "114380235": {
        en: "Member_Beyond Chocolate_Retail",
        de: "Member_Beyond Chocolate_Retail"
    },
  "110440021": {
        en: "Member_GISCO_Industry",
        de: "Member_GISCO_Industry"
    },
  "118270247": {
        en: "Member_GISCO_NGO",
        de: "Member_GISCO_NGO"
    },
  "110470073": {
        en: "Member_GISCO_Retail",
        de: "Member_GISCO_Retail"
    },
  "120260091": {
        en: "Member_GISCO_Beyond Chocolate_Industry",
        de: "Member_GISCO_Beyond Chocolate_Industry"
    },
  "126180526": {
        en: "Member_GISCO_Beyond Chocolate_Retail",
        de: "Member_GISCO_Beyond Chocolate_Retail"
    },
  "108490561": {
        en: "Member_GISCO_Beyond Chocolate_Standard setting organisation",
        de: "Member_GISCO_Beyond Chocolate_Standard setting organisation"
    },
    "111510043": {
        en: "Projects - GISCO",
        de: "Projects - GISCO"
    },
    "113130042": {
        en: "B - Industry",
        de: "B - Industrie"
    },
    "105640815": {
        en: "C - Retail",
        de: "C - Lebensmittelhandel"
    },
    "111890828": {
        en: "D - Civil Society (NGOs)",
        de: "D - Zivilgesellschaft (NROs)"
    },
    "134210832": {
        en: "D - Standard setting organisations",
        de: "D - Standardsetzende Organisationen"
    },
    //
    "143215090": {
        en: "Projects - Beyond Chocolate",
        de: "Projects - Beyond Chocolate"
    },
    "130990814": {
        en: "B - Industry - Beyond Chocolate",
        de: "B - Industrie - Beyond Chocolate"
    },
    "143340791": {
        en: "C - Retail - Beyond Chocolate",
        de: "C - Lebensmittelhandel - Beyond Chocolate"
    },
    "150700609": {
        en: "D - Civil Society (NGOs) - Beyond Chocolate",
        de: "D - Zivilgesellschaft (NROs) - Beyond Chocolate"
    },
    "148430590": {
        en: "D - Standard setting organisations - Beyond Chocolate",
        de: "D - Standardsetzende Organisationen - Beyond Chocolate"
    },
    "150981538": {
        en: "Pilot-monitoring of the German initiative for sustainable cocoa",
        de: "Pilot-Monitoring des Forum Nachhaltiger Kakao"
    }
};

export { useLocale, langs, questionnaire };
