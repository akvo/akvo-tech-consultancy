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
    "102420261": {
        en: "Projects",
        de: "Projects"
    },
    "114380434": {
        en: "Member Beyond Chocolate Standard setting organisations",
        de: "Beyond Chocolate - Standardsetzende Organisatione"
    },
  "122170164": {
        en: "Member Beyond Chocolate Industry including Brands",
        de: "Beyond Chocolate Industrie inklusive Eigenmarken"
    },
  "114380235": {
        en: "Member Beyond Chocolate Retail",
        de: "Beyond Chocolate Einzelhandel"
    },
  "110440021": {
        en: "Member GISCO Industry including Brands",
        de: "Forum Nachhaltiger Kakao - Industrie inklusive Eigenmarken"
    },
  "118270247": {
        en: "Member GISCO NGOs and other member types",
        de: "Forum Nachhaltiger Kakao - Nichtregierungsorganisationen (NGOs) und andere Mitglieder"
    },
  "110470073": {
        en: "Member GISCO Retail",
        de: "Forum Nachhaltiger Kakao - Einzelhandel"
    },
  "104340413": {
        en: "Member GISCO Standard setting organisation",
        de: "Forum Nachhaltiger Kakao - Standardsetzende Organisationen"
    },
  "120260091": {
        en: "Member GISCO Beyond Chocolate Industry including Brands",
        de: "Beyond Chocolate & Forum Nachhaltiger Kakao - Industrie inklusive Eigenmarken"
    },
  "126180526": {
        en: "Member GISCO Beyond Chocolate Retail",
        de: "Beyond Chocolate & Forum Nachhaltiger Kakao - Einzelhandel"
    },
  "108490561": {
        en: "Member GISCO Beyond Chocolate Standard setting organisation",
        de: "Beyond Chocolate & Forum Nachhaltiger Kakao - Standardsetzende Organisationen"
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
