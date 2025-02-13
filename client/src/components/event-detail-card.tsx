import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import useEventPrize from "@/hook/useEventPrize";
import useQuestionEvent from "@/hook/useQuestionEvent";
import { toast } from "@/hooks/use-toast";
import apiCall from "@/lib/apiCall";
import { TEvent, TEventDetail } from "@/types/events";
import dayjs from "dayjs";
import { MedalIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MagicCard } from "./ui/magic-card";
import { Separator } from "./ui/separator";

interface IEventPreviewCard {
    event: TEvent;
}

export default function EventDetailCard({ event }: IEventPreviewCard) {
    const { setStatus, status } = useEvent();
    const { handleOpenDialog } = useQuestionEvent();
    const { handleOpen: handleOpenEvnetPrizeDialog, setPrize } =
        useEventPrize();

    const [loading, SetLoading] = useState<boolean>(false);
    const [loadingEntry, SetLoadingEntry] = useState<boolean>(false);
    const [detail, SetDetail] = useState<TEventDetail | null>(null);

    const getEventDetail = async (id: string) => {
        if (loading) return;

        SetLoading(true);

        const apiCalled = await apiCall<TEventDetail, any>({
            method: "GET",
            path: ["event", "client", ":id"],
            params: {
                id: id,
            },
        });

        SetLoading(false);

        if (!apiCalled || !apiCalled?.success || !apiCalled.data) {
            SetDetail(null);
            return;
        }

        SetDetail(apiCalled.data);
    };

    const handleEntry = async () => {
        if (loadingEntry) return;

        SetLoadingEntry(true);

        const apiCalled = await apiCall({
            method: "POST",
            path: ["event", "client", "entry", ":eventId"],
            params: {
                eventId: event.id,
            },
        });

        SetLoadingEntry(false);

        if (apiCalled?.success) {
            setStatus(EEventView.ON_PROGRESS);
            handleOpenDialog(true);
        } else {
            toast({
                title: "Entry failed!",
                description: apiCalled?.message,
                variant: "destructive",
            });
        }
    };

    const handleTakePrize = async () => {
        const apiCalled = await apiCall<{ prize: string }, any>({
            path: ["event", "client", "prize", "take", event.id],
            method: "POST",
        });

        if (apiCalled?.success) {
            handleOpenEvnetPrizeDialog(true);

            setPrize(apiCalled.data?.prize || "");

            return;
        }

        toast({
            title: "Failed!",
            description: apiCalled?.message,
            variant: "destructive",
        });
    };

    useEffect(() => {
        getEventDetail(event.id);
    }, [event]);

    if (loading) return <Loading />;

    if (!detail) return <NotFound />;

    const validEntry = !!(
        new Date() < new Date(detail.start) ||
        (detail.end && new Date() > new Date(detail.end))
    );

    return (
        <div className="w-full flex flex-col gap-5">
            <MagicCard className="h-auto w-full [&>div:nth-child(2)]:w-full [&>div:nth-child(2)]:h-fit shadow-xl shadow-muted">
                <div className="h-auto w-full box-border p-3 relative">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="w-full flex justify-between items-center">
                            <p className="font-bold text-lg flex-1 relative text-ellipsis line-clamp-2">
                                Event Detail
                            </p>
                            <div className="bg-primary text-background rounded-md p-2">
                                <p className="text-xs">
                                    <span className="font-bold mr-1">
                                        {detail.quesPassCount < 10 ? "0" : ""}
                                        {detail.quesPassCount}
                                    </span>

                                    <span className="font-bold mr-1">/</span>
                                    <span className="font-bold mr-1">
                                        {detail.quesCount < 10 ? "0" : ""}
                                        {detail.quesCount}
                                    </span>
                                    <span>Queses</span>
                                </p>
                            </div>
                        </div>

                        <Separator orientation="horizontal" />

                        <div className="p-0">
                            <div className="grid grid-cols-7">
                                <p className="col-span-2 text-xs font-bold ">
                                    Name
                                </p>
                                <p className="col-span-5 text-sm">
                                    {detail.name}
                                </p>
                            </div>
                            <div className="grid grid-cols-7">
                                <p className="col-span-2 text-xs font-bold ">
                                    Open
                                </p>
                                <p className="col-span-5 text-sm">
                                    {dayjs(detail.start)
                                        .locale("vi")
                                        .format("HH:mm MM/DD/YYYY")}
                                </p>
                            </div>
                            {!!detail.end && detail.end !== detail.start && (
                                <div className="grid grid-cols-7">
                                    <p className="col-span-2 text-xs font-bold ">
                                        End
                                    </p>
                                    <p className="col-span-5 text-sm">
                                        {dayjs(detail.end)
                                            .locale("vi")
                                            .format("HH:mm MM/DD/YYYY")}
                                    </p>
                                </div>
                            )}
                            {!!detail.description.length && (
                                <>
                                    <Separator
                                        orientation="horizontal"
                                        className="my-2"
                                    />
                                    <div
                                        className="w-full"
                                        dangerouslySetInnerHTML={{
                                            __html: detail.description,
                                        }}
                                    ></div>
                                </>
                            )}

                            <Separator
                                orientation="horizontal"
                                className="my-2"
                            />

                            <div className="flex justify-end w-full relative gap-3">
                                {detail.canTakePrize && (
                                    <Button
                                        variant={"outline"}
                                        onClick={handleTakePrize}
                                    >
                                        <span>
                                            <MedalIcon size={15} />
                                        </span>
                                        <span>Take prize</span>
                                    </Button>
                                )}
                                <Button
                                    disabled={validEntry}
                                    onClick={handleEntry}
                                >
                                    <span>
                                        <PlayIcon size={15} />
                                    </span>
                                    <span>
                                        {!validEntry ? "Entry" : "Not valid"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
}

function Loading() {
    return <p>loading...</p>;
}

function NotFound() {
    return <p>This is event is not found!</p>;
}
