import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import { cn } from "@/lib/utils";
import { TEvent } from "@/types/events";
import {
    AnchorIcon,
    KeySquareIcon,
    MousePointer2Icon,
    PickaxeIcon,
    XIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface IEventStatusBox {
    event: TEvent;
    status: EEventView;
}

const textStatus = {
    [EEventView.IDLE]: "On waiting",
    [EEventView.ON_PROGRESS]: "In progress",
    [EEventView.PREVIEW]: "Previewing content",
    [EEventView.ON_SOLVING]: "Solving questions",
};

export default function EventStatusBox({ event, status }: IEventStatusBox) {
    const { setEvent, setStatus } = useEvent();

    const color = {
        [EEventView.IDLE]: {
            shadow: "shadow-primary",
            bg: "bg-primary",
            text: "text-primary",
        },
        [EEventView.PREVIEW]: {
            shadow: "shadow-[#ffbd90]",
            bg: "bg-[#ffbd7b]",
            text: "text-[#ffbd7b]",
        },
        [EEventView.ON_PROGRESS]: {
            shadow: "shadow-[#FE8FB590]",
            bg: "bg-[#FE8FB5]",
            text: "text-[#FE8FB5]",
        },
        [EEventView.ON_SOLVING]: {
            shadow: "shadow-[#A07CFE90]",
            bg: "bg-[#A07CFE]",
            text: "text-[#A07CFE]",
        },
    };

    const handleCloseEvent = () => {
        document.title = "Welcome!";

        setEvent(null);
        setStatus(EEventView.IDLE);
    };

    return (
        <Card className="w-fit box-border p-5 border-none duration-150 group relative max-md:w-full">
            <div className="lg:w-[300px] md:w-full flex items-center gap-5 relative z-[1]">
                <div>
                    <div
                        className={cn(
                            "size-10 rounded-md bg-background flex items-center justify-center relative overflow-hidden",
                            `shadow-lg`,
                            color[status].shadow
                        )}
                    >
                        <div className="absolute top-0 left-0 bg-gradient-to-br from-[#ffffff40] to-transparent w-full h-full z-[1]" />
                        <div className="absolute top-0 left-0 bg-gradient-to-tl from-[#00000050] to-transparent w-full h-full z-[1]" />
                        <div
                            className={cn(
                                "relative w-full h-full z-[0] flex items-center justify-center",
                                color[status].bg
                            )}
                        >
                            <span className={cn("text-background ")}>
                                {status === EEventView.IDLE && (
                                    <MousePointer2Icon
                                        size={15}
                                        className=" stroke-[3px]"
                                    />
                                )}

                                {status === EEventView.PREVIEW && (
                                    <AnchorIcon
                                        size={15}
                                        className=" stroke-[3px]"
                                    />
                                )}

                                {status === EEventView.ON_PROGRESS && (
                                    <PickaxeIcon size={15} />
                                )}

                                {status === EEventView.ON_SOLVING && (
                                    <KeySquareIcon size={15} />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-1">
                    <p className="text-sm line-clamp-1 text-ellipsis w-full font-medium">
                        {event.name}
                    </p>
                    <div>
                        <p
                            className={cn(
                                color[status].text,
                                "text-xs font-bold line-clamp-1 text-ellipsis"
                            )}
                        >
                            {textStatus[status]}
                        </p>
                    </div>
                </div>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    size={"icon"}
                                    variant={"destructive"}
                                    onClick={handleCloseEvent}
                                >
                                    <XIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Close</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </Card>
    );
}
