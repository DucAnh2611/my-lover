import { EEventView } from "@/enums/event";
import { TEvent } from "@/types/events";
import { createContext, ReactNode, useState } from "react";

interface IEventContext {
    event: TEvent | null;
    status: EEventView;
    setEvent: (event: TEvent | null) => void;
    setStatus: (status: EEventView) => void;
}

export const EventContext = createContext<IEventContext>({
    event: null,
    status: EEventView.IDLE,
    setEvent(event) {},
    setStatus(status) {},
});

export default function EventProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [event, SetEvent] = useState<TEvent | null>(null);
    const [status, SetStatus] = useState<EEventView>(EEventView.IDLE);

    const setEvent = (event: TEvent | null) => {
        SetEvent(event);
    };

    const setStatus = (status: EEventView) => {
        SetStatus(status);
    };

    return (
        <EventContext.Provider value={{ event, setEvent, status, setStatus }}>
            {children}
        </EventContext.Provider>
    );
}
