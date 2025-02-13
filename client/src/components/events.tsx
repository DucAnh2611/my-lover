import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import { cn } from "@/lib/utils";
import { TEvent } from "@/types/events";
import dayjs from "dayjs";
import { HeartIcon } from "lucide-react";

export default function EventCard({ event }: { event: TEvent }) {
    const { event: eventSelected, status } = useEvent();

    const { name, description, id } = event;

    const color = {
        [EEventView.IDLE]: {
            shadow: "[box-shadow:0_0px_20px_0px_#ffffff90_inset] hover:[box-shadow:0_0px_60px_0px_#ffffff90_inset]",
        },
        [EEventView.PREVIEW]: {
            shadow: "[box-shadow:0_0px_20px_0px_#ffbc9090_inset] hover:[box-shadow:0_0px_30px_0px_#ffbd9090_inset]",
        },
        [EEventView.ON_PROGRESS]: {
            shadow: "[box-shadow:0_0px_20px_0px_#FE8FB590_inset] hover:[box-shadow:0_0px_60px_0px_#FE8FB590_inset]",
        },
        [EEventView.ON_SOLVING]: {
            shadow: "[box-shadow:0_0px_20px_0px_#A07CFE90_inset] hover:[box-shadow:0_0px_60px_0px_#A07CFE90_inset]",
        },
    };

    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out",
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)]",
                eventSelected?.id === id
                    ? ` ${color[status].shadow}`
                    : "[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] hover:[box-shadow:0_-20px_80px_-20px_#ffffff30_inset]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-pink-500">
                    <span className="text-lg text-primary">
                        <HeartIcon size={15} />
                    </span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white max-md:flex-col max-md:items-start">
                        <span className="text-sm sm:text-lg text-ellipsis max-md:w-full">
                            {name}
                        </span>
                        <span className="mx-1 max-md:hidden">·</span>
                        <span className="text-xs text-gray-500">
                            {dayjs(event.start)
                                .locale("vi")
                                .format("HH:mm a DD/MM/YYYY")}
                        </span>
                    </figcaption>
                </div>
            </div>
        </figure>
    );
}
