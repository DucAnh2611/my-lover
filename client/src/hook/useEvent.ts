import { EventContext } from "@/context/event.context";
import { useContext } from "react";

export default function useEvent() {
    const eventCtx = useContext(EventContext);

    if (!eventCtx) {
        throw new Error("EventContext is not initialized!");
    }

    return eventCtx;
}
