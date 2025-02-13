import { EQuestionStatusRequirement } from "@/enums/question";
import useEvent from "@/hook/useEvent";
import useEventPrize from "@/hook/useEventPrize";
import useQuestion from "@/hook/useQuestion";
import useQuestionEvent from "@/hook/useQuestionEvent";
import { toast } from "@/hooks/use-toast";
import apiCall from "@/lib/apiCall";
import { cn } from "@/lib/utils";
import { TQuestionTree } from "@/types/question";
import { CheckIcon, LightbulbIcon, LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionSolveDialog from "./question-solve-dialog";
import { Card, CardContent } from "./ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel";
import { Separator } from "./ui/separator";

interface IQuestionTree {
    questions: TQuestionTree[];
}

const parseTextStatus: Record<EQuestionStatusRequirement, string> = {
    [EQuestionStatusRequirement.LOCKED]: "Locked",
    [EQuestionStatusRequirement.PASS]: "Passed",
    [EQuestionStatusRequirement.SOLVING]: "Solving",
};

const themeStatus = {
    [EQuestionStatusRequirement.LOCKED]: {
        border: "border-muted",
        text: "text-muted-foreground",
        shadow: "shadow-muted",
        requirementBorder: "!border-destructive",
        requirementBg: "bg-red-900 bg-opacity-15",
        requirementText: "text-red-700",
        requirementShadow: "shadow-destructive",
    },
    [EQuestionStatusRequirement.PASS]: {
        border: "border-green-500",
        text: "text-green-500",
        shadow: "shadow-green-700",
        requirementBorder: "!border-green-500",
        requirementBg: "bg-green-900 bg-opacity-15",
        requirementText: "text-green-500",
        requirementShadow: "shadow-green-700",
    },
    [EQuestionStatusRequirement.SOLVING]: {
        border: "border-[#ffbd7b]",
        text: "text-[#ffbd7b]",
        shadow: "shadow-[#ffbd7b90]",
        requirementBorder: "!border-[#ffbd7b]",
        requirementBg: "bg-[#ffbd7b] bg-opacity-15",
        requirementText: "text-[#ffbd7b]",
        requirementShadow: "shadow-[#ffbd7b90]",
    },
};

export default function EventQuestion({ questions }: IQuestionTree) {
    const [api, setApi] = useState<CarouselApi>();
    const { reload, handleOpenDialog: handleOpenEventQuestionDialog } =
        useQuestionEvent();
    const { setQuestion: SetSelected, question: selected } = useQuestion();
    const { handleOpen: handleOpenEventPrize, setPrize } = useEventPrize();
    const { event, setStatus } = useEvent();

    const onPassLastQuestion = async () => {
        if (!event) return;
        const apiCalled = await apiCall<{ prize: string }, any>({
            path: ["event", "client", "prize", "take", event.id],
            method: "POST",
        });

        if (apiCalled?.success) {
            handleOpenEventQuestionDialog(false);
            handleOpenEventPrize(true);

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
        if (!api) {
            return;
        }

        SetSelected(questions[api.selectedScrollSnap()]);

        api.on("select", () => {
            SetSelected(questions[api.selectedScrollSnap()]);
        });
    }, [api]);

    useEffect(() => {
        SetSelected(null);
    }, [reload]);

    return (
        <div className="w-full flex flex-col gap-3 max-md:h-full max-md:flex-1">
            {!!questions.length ? (
                <div className="w-full px-12">
                    <Carousel setApi={setApi}>
                        <CarouselContent>
                            {questions.map((question) => (
                                <CarouselItem
                                    key={
                                        question.id + "event" + question.eventId
                                    }
                                >
                                    <div
                                        className={cn(
                                            "cursor-pointer w-full h-[200px] flex flex-col items-center justify-center gap-5"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-[100px] h-[100px] border-2 rounded-full flex items-center justify-center duration-150 border-primary shadow-xl",
                                                question.id === selected?.id
                                                    ? "opacity-100"
                                                    : "opacity-50",
                                                themeStatus[question.status]
                                                    .border,
                                                themeStatus[question.status]
                                                    .shadow
                                            )}
                                        >
                                            <p
                                                className={cn(
                                                    "w-fit h-fit m-0 font-bold text-3xl leading-none",
                                                    themeStatus[question.status]
                                                        .text
                                                )}
                                            >
                                                {question.no}
                                            </p>
                                        </div>
                                        <div className="w-full h-fit flex flex-col items-center justify-center">
                                            <p
                                                className={cn(
                                                    "text-md font-bold line-clamp-1 text-ellipsis w-[80%] text-center h-fit",
                                                    themeStatus[question.status]
                                                        .text
                                                )}
                                            >
                                                {question.title}
                                            </p>
                                            <p
                                                className={cn(
                                                    "text-sm",
                                                    themeStatus[question.status]
                                                        .text
                                                )}
                                            >
                                                {
                                                    parseTextStatus[
                                                        question.status
                                                    ]
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            ) : (
                <Card className="py-20 w-full">
                    <p className="w-full text-center text-sm">
                        This event have no questions!
                    </p>
                </Card>
            )}
            {selected && (
                <Card
                    className={cn([
                        selected.status === EQuestionStatusRequirement.PASS
                            ? "border-green-500 [box-shadow:0_-20px_80px_-20px_#22c55e90_inset]"
                            : "",
                        selected.status === EQuestionStatusRequirement.SOLVING
                            ? "border-[#ffbd7b] [box-shadow:0_-20px_80px_-20px_#ffbd7b90_inset]"
                            : "",
                        "border max-md:flex-1",
                    ])}
                >
                    <CardContent
                        className={cn(
                            "w-full p-5 flex flex-col gap-3 max-md:p-3 max-md:h-full"
                        )}
                    >
                        <div className="w-full">
                            <p className="text-normal font-bold line-clamp-1 w-full">
                                {selected.title}
                            </p>
                            <p className="text-sm line-clamp-2 w-full h-[40px]">
                                {selected.description ||
                                    "Question have no description!"}
                            </p>
                        </div>

                        <Separator orientation="horizontal" />

                        <p className="font-bold text-xs">Requirements:</p>

                        {!!selected.requirement.length ? (
                            <div className="w-full">
                                <Carousel>
                                    <CarouselContent className="pb-1">
                                        {selected.requirement.map((r) => (
                                            <CarouselItem
                                                key={
                                                    r.id +
                                                    "question_requirement"
                                                }
                                                className="md:basis-1/2"
                                            >
                                                <Card
                                                    className={cn(
                                                        themeStatus[r.status]
                                                            .requirementBorder,
                                                        "p-2 md:p-3 w-full"
                                                    )}
                                                >
                                                    <div className="flex gap-2 flex-col-reverse md:flex-row items-start md:items-center justify-between">
                                                        <p className="text-xs text-muted-foreground">
                                                            Ques: {r.no}
                                                        </p>
                                                        <div
                                                            className={cn(
                                                                themeStatus[
                                                                    r.status
                                                                ]
                                                                    .requirementText,
                                                                themeStatus[
                                                                    r.status
                                                                ].requirementBg,
                                                                themeStatus[
                                                                    r.status
                                                                ]
                                                                    .requirementBorder,
                                                                "text-xs font-bold rounded-md px-3 py-1 flex gap-1 items-center border"
                                                            )}
                                                        >
                                                            <span>
                                                                {
                                                                    parseTextStatus[
                                                                        r.status
                                                                    ]
                                                                }
                                                            </span>
                                                            <span>
                                                                {r.status ===
                                                                    EQuestionStatusRequirement.LOCKED && (
                                                                    <LockIcon
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                )}
                                                                {r.status ===
                                                                    EQuestionStatusRequirement.PASS && (
                                                                    <CheckIcon
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                )}
                                                                {r.status ===
                                                                    EQuestionStatusRequirement.SOLVING && (
                                                                    <LightbulbIcon
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold line-clamp-1 text-ellipsis mt-1">
                                                        <span>{r.title}</span>
                                                    </p>
                                                    <p className="text-ellipsis line-clamp-1 text-xs">
                                                        {r.event.name}
                                                    </p>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            </div>
                        ) : (
                            <div className="w-full flex py-9">
                                <p className="md:text-base text-center text-sm text-muted-foreground w-full">
                                    This question have no requirement!
                                </p>
                            </div>
                        )}

                        <div className="w-full flex-1 flex flex-col justify-between ">
                            <Separator
                                orientation="horizontal"
                                className="mb-5"
                            />
                            <QuestionSolveDialog
                                question={selected}
                                isLastQuestion={
                                    questions[questions.length - 1] &&
                                    selected.id ===
                                        questions[questions.length - 1].id
                                }
                                onPassLastQuestion={onPassLastQuestion}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
