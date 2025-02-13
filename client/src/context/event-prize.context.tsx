import { createContext, ReactNode, useState } from "react";

export interface IEventPrizeContext {
    open: boolean;
    handleOpen: (open: boolean) => void;
    prize: string;

    setPrize: (prize: string) => void;
    reset: () => void;
}

export const EventPrizeContext = createContext<IEventPrizeContext>({
    open: false,
    handleOpen: function (open: boolean): void {},
    prize: "",
    setPrize: function (prize: string): void {},
    reset: function (): void {},
});

export default function EventPrizeProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [open, SetOpen] = useState<boolean>(false);
    const [prize, SetPrize] = useState<string>("");

    const reset = () => {
        SetPrize("");
    };

    const setPrize = (prize: string) => {
        SetPrize(prize);
    };

    const handleOpen = (o: boolean) => {
        SetOpen(o);
    };

    return (
        <EventPrizeContext.Provider
            value={{
                open,
                handleOpen,
                setPrize,
                prize,
                reset,
            }}
        >
            {children}
        </EventPrizeContext.Provider>
    );
}
