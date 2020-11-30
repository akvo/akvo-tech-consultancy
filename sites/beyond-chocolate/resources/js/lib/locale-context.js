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

export { useLocale, langs }