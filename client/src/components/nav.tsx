import { StorageConfig } from "@/configs/local-str";
import useAuth from "@/hook/useAuth";
import apiCall from "@/lib/apiCall";
import { ListIcon, LoaderCircleIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGradientText from "./ui/animated-gradient-text";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

export default function Navigation() {
    const navigate = useNavigate();
    const { isLogin, code, setAuth } = useAuth();

    const [isLoggingOut, SetIsLoggingOut] = useState<boolean>(false);

    const handleHome = () => {
        navigate("/");
    };

    const hanldeLogout = async () => {
        if (!isLogin || isLoggingOut) return;

        SetIsLoggingOut(true);

        const called = await apiCall({
            method: "POST",
            path: "code/client/logout",
        });

        if (called?.success) {
            localStorage.removeItem(StorageConfig.local.name);
            setAuth({ isLogin: false, code: null });
        }

        SetIsLoggingOut(false);
    };

    if (!isLogin) return null;

    return (
        <nav className="w-full flex items-center justify-between gap-4">
            <div className="flex-1 h-auto flex justify-start items-center">
                <AnimatedGradientText className="w-fit h-fit mx-0">
                    <p className="font-bold font-mono tracking-wider text-lg">
                        I'm {code}
                    </p>
                </AnimatedGradientText>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="w-fit h-fit flex gap-2">
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <Button
                                size={"icon"}
                                variant={"default"}
                                onClick={handleHome}
                            >
                                <ListIcon size={15} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            Danh sách sự kiện
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <Button
                                size={isLoggingOut ? "default" : "icon"}
                                variant={"destructive"}
                                onClick={hanldeLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <>
                                        <LoaderCircleIcon
                                            size={15}
                                            className="animate-spin"
                                        />
                                        Logging out
                                    </>
                                ) : (
                                    <>
                                        <LogOutIcon size={15} />
                                    </>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            {isLoggingOut ? "Calling" : "Logout"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </nav>
    );
}
