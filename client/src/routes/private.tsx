import { StorageConfig } from "@/configs/local-str";
import useAuth from "@/hook/useAuth";
import { TLocalStorage } from "@/types/storage";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function PrivateRoutes() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isLogin, setAuth } = useAuth();

    useEffect(() => {
        if (!isLogin) {
            const str = localStorage.getItem(StorageConfig.local.name);
            if (!str) {
                navigate(`/auth?redirect=${encodeURI(location.pathname)}`, {
                    replace: true,
                });
                return;
            } else {
                const strData: TLocalStorage = JSON.parse(str);
                setAuth({ isLogin: true, code: strData.code });
            }
        }
    }, [isLogin, navigate]);

    return <Outlet />;
}
