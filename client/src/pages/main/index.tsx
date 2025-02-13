import EventCard from "@/components/events";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import apiCall from "@/lib/apiCall";
import { TEvent, TSApiEventList } from "@/types/events";
import { useEffect, useState } from "react";

export default function MainPage() {
    const [events, SetEvents] = useState<TEvent[]>([]);
    const { event, setEvent, setStatus } = useEvent();

    const getEvents = async () => {
        const callEvents = await apiCall<TSApiEventList, any>({
            method: "GET",
            path: "event/client",
        });

        if (!callEvents?.success) {
            SetEvents([]);
            return;
        }

        SetEvents(callEvents.data?.items || []);
    };

    const handleSelectEvent = (e: TEvent) => () => {
        if (event?.id === e.id) return;

        setEvent(e);
        setStatus(EEventView.PREVIEW);
        document.title = `Preview - ${e.name}`;
    };

    useEffect(() => {
        document.title = "Welcome!";
        getEvents();
    }, []);

    return (
        <div className="w-full h-full">
            <div className="max-h-full overflow-hidden overflow-y-auto py-2 box-border w-full flex-1">
                <AnimatedList className="w-full h-fit gap-2">
                    {events.map((e) => (
                        <AnimatedListItem key={e.id + "main"}>
                            <div onClick={handleSelectEvent(e)}>
                                <EventCard event={e} />
                            </div>
                        </AnimatedListItem>
                    ))}
                </AnimatedList>
            </div>
        </div>
    );
}
