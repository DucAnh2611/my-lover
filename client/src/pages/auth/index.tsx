import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { AnimatedList } from "@/components/ui/animated-list";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { MagicCard } from "@/components/ui/magic-card";
import Ripple from "@/components/ui/ripple";
import { Separator } from "@/components/ui/separator";
import ShinyButton from "@/components/ui/shiny-button";
import SparklesText from "@/components/ui/sparkles-text";
import { StorageConfig } from "@/configs/local-str";
import { EEventView } from "@/enums/event";
import { EFormState } from "@/enums/form";
import useAuth from "@/hook/useAuth";
import useEvent from "@/hook/useEvent";
import apiCall from "@/lib/apiCall";
import { TLocalStorage } from "@/types/storage";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const confettiRef = useRef<ConfettiRef>(null);
    const { setAuth } = useAuth();
    const { setEvent, setStatus } = useEvent();

    const [code, SetCode] = useState<string>();
    const [loading, SetLoading] = useState<boolean>(false);
    const [message, SetMessage] = useState<string | null>(null);
    const [formState, SetFormState] = useState<EFormState>(EFormState.IDLE);
    const [redirect, SetRedirect] = useState<boolean>(false);

    const handleCode = (code: string) => {
        SetMessage(null);
        SetCode(code);
        SetFormState(EFormState.IDLE);
    };

    const handleLogin = async () => {
        if (!code || code?.length < 6 || !parseInt(code) || loading) return;

        SetLoading(true);

        const login = await apiCall({
            method: "POST",
            path: ["code", "client", "auth"],
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                code,
            },
            credentials: "include",
        });

        if (!login?.success) {
            SetMessage(login?.message || "Login error!");
            SetFormState(EFormState.FAIL);
            setAuth({ isLogin: false, code: null });
        } else {
            SetMessage("Login successfully!");
            SetFormState(EFormState.OK);

            localStorage.setItem(
                StorageConfig.local.name,
                JSON.stringify({
                    code,
                    isLogin: true,
                } as TLocalStorage)
            );
            setEvent(null);
            setStatus(EEventView.IDLE);
            setAuth({ isLogin: true, code });
            SetRedirect(true);
        }

        SetLoading(false);
    };

    document.title = "Login";

    useEffect(() => {
        if (!redirect) return;

        let rTime = 5;

        const interval = setInterval(() => {
            if (rTime < 0) {
                const searchs = location.search.split("&");
                if (!searchs.length) {
                    navigate("/", { replace: true });
                    return;
                }
                const redirect = searchs.find((i) => i.startsWith("redirect"));
                if (!redirect) {
                    navigate("/", { replace: true });
                    return;
                }

                const [_key, path] = redirect.split("=");
                navigate(path, { replace: true });
                return;
            }

            SetMessage(`Auto redirect after ${rTime}s!`);
            rTime--;
        }, 1000);
        confettiRef.current?.fire({});

        return () => {
            clearInterval(interval);
        };
    }, [redirect]);

    return (
        <div className="w-[100dvw] h-[100dvh] overflow-hidden grid place-items-center">
            <div className="flex flex-col gap-5">
                <MagicCard className="w-fit h-fit p-10">
                    <div className=" flex justify-center items-center flex-col gap-5">
                        <div className="w-auto flex flex-col items-center justify-center">
                            <SparklesText
                                text="Login"
                                className="text-4xl"
                                sparklesCount={5}
                            />
                            <p className="font-light text-sm mt-1">
                                Use provided code to login.
                            </p>
                        </div>

                        <Separator orientation="horizontal" className="w-1/2" />

                        <div>
                            <InputOTP maxLength={6} onChange={handleCode}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="w-full">
                            <ShinyButton
                                className="w-full cursor-pointer"
                                onClick={handleLogin}
                            >
                                Login
                            </ShinyButton>
                        </div>
                    </div>
                </MagicCard>
                <Confetti
                    ref={confettiRef}
                    className="absolute left-0 top-0 z-0 size-full"
                />

                {formState !== EFormState.IDLE && (
                    <AnimatedList>
                        <div className="w-full flex items-center justify-center rounded-sm p-1">
                            <AnimatedGradientText>
                                <p
                                    className={`${
                                        formState === EFormState.FAIL
                                            ? "text-destructive"
                                            : ""
                                    } ${
                                        formState === EFormState.OK
                                            ? "text-green-400"
                                            : ""
                                    } font-medium text-sm`}
                                >
                                    {message}
                                </p>
                            </AnimatedGradientText>
                        </div>
                    </AnimatedList>
                )}
            </div>
            <Ripple />
        </div>
    );
}
