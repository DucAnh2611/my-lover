import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import useEventPrize from "@/hook/useEventPrize";
import useQuestionEvent from "@/hook/useQuestionEvent";
import { toast } from "@/hooks/use-toast";
import apiCall from "@/lib/apiCall";
import { TEvent } from "@/types/events";
import { TApiQuestionList } from "@/types/question";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EventQuestion from "./event-question";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

interface IEventQuestionDialog {}

export default function EventQuestionDialog({}: IEventQuestionDialog) {
    const {
        openDialog,
        handleOpenDialog,
        setQuestions,
        questions,
        reload,
        setReload,
    } = useQuestionEvent();
    const { event, setStatus } = useEvent();
    const { setPrize } = useEventPrize();

    const [loading, SetLoading] = useState<boolean>(false);
    const [count, SetCount] = useState<number>(0);

    const onOpenChange = (open: boolean) => {
        if (!open) {
            setStatus(EEventView.PREVIEW);

            setPrize("");
        }
        handleOpenDialog(open);
    };

    const getQuestion = async (event: TEvent) => {
        if (loading) return;

        SetLoading(true);
        setQuestions([]);

        const apiCalled = await apiCall<TApiQuestionList, any>({
            method: "GET",
            path: ["question", "client", ":eventId", "list"],
            params: {
                eventId: event.id,
            },
        });
        SetLoading(false);
        setReload(false);

        if (!apiCalled?.success) {
            toast({
                title: "Get questions failed!",
                description: apiCalled?.message,
                variant: "destructive",
            });
            return;
        }
        if (!apiCalled.data) {
            toast({
                title: "Get questions failed!",
                description: "Data received failed!",
                variant: "destructive",
            });
            return;
        }
        setQuestions(apiCalled.data.items);
        SetCount(apiCalled.data.count);
    };

    useEffect(() => {
        if ((openDialog && event) || (reload && event)) {
            getQuestion(event);
        }
    }, [openDialog, event, reload]);

    return (
        <Dialog open={openDialog} onOpenChange={onOpenChange}>
            <DialogContent className="max-md:h-full max-md:px-3 max-md:flex max-md:flex-col">
                <DialogHeader>
                    <DialogTitle>Questions</DialogTitle>
                    <DialogDescription>
                        Select question in event, complete all questions to know
                        event prize.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full h-fit overflow-hidden max-md:flex-1 flex flex-col">
                    <div className="w-full">
                        <Button
                            variant={"outline"}
                            className="w-full"
                            disabled={reload}
                            onClick={() => {
                                if (reload) return;
                                setReload(true);
                            }}
                        >
                            {reload && (
                                <LoaderIcon
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                            Reload
                        </Button>
                    </div>
                    <EventQuestion questions={questions} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
