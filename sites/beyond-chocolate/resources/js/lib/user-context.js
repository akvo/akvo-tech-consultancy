import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect
} from "react";

const UserContext = createContext();

const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within an UserProvider");
    }
    return context;
};

const UserProvider = ({ init, ...props }) => {
    const [user, setUser] = useState();

    if (typeof init === "function") {
        useEffect(async () => {
            const initUser = await init();
            setUser(initUser);
        }, []);
    }

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, useUser };
