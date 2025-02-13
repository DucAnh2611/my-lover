import { createContext, ReactNode, useState } from "react";

interface IAuthContext {
    code: string | number | null;
    isLogin: boolean;
    setAuth: (auth: { isLogin: boolean; code: number | string | null }) => void;
}

export const AuthContext = createContext<IAuthContext>({
    isLogin: false,
    code: null,
    setAuth(auth) {},
});

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [code, SetCode] = useState<string | number | null>(null);
    const [isLogin, SetIsLogin] = useState<boolean>(false);

    const setAuth = (auth: {
        isLogin: boolean;
        code: string | number | null;
    }) => {
        SetIsLogin(auth.isLogin);
        SetCode(auth.code);
        return;
    };

    return (
        <AuthContext.Provider value={{ isLogin, code, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
