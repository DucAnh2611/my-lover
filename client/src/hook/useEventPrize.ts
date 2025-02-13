import { EventPrizeContext } from "@/context/event-prize.context";
import { useContext } from "react";

export default function useEventPrize() {
    const context = useContext(EventPrizeContext);

    if (!context) {
        throw new Error("EventPrizeContext is not initialized!");
    }

    return context;
}
