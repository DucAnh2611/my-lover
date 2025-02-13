import { EAddHistoryMode, EQuestionCodeHistoryStatus } from "@/enums/question";
import { cn } from "@/lib/utils";
import { TQuestionHistory, TTabData } from "@/types/question";
import dayjs from "dayjs";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface IQuestionHistoryCardProps {
    history: TQuestionHistory;
    handleAddHistoryToTabCode: (
        code: string,
        mode: EAddHistoryMode,
        tab: TTabData
    ) => void;
    tabs: TTabData[];
}

const textStatus = {
    [EQuestionCodeHistoryStatus.CORRECT]: "Chính xác",
    [EQuestionCodeHistoryStatus.INCORRECT]: "Chưa chính xác",
};

export default function QuestionHistoryCard({
    history,
    handleAddHistoryToTabCode,
    tabs,
}: IQuestionHistoryCardProps) {
    const FunctionsButton = [
        {
            mode: EAddHistoryMode.ADD_START,
            title: "Add start",
        },
        {
            mode: EAddHistoryMode.ADD_END,
            title: "Add end",
        },
        {
            mode: EAddHistoryMode.REPLACE,
            title: "Replace",
        },
    ];
    return (
        <div
            className={cn(
                "w-full max-h-[200px] h-fit rounded-md overflow-hidden box-border p-2 md:p-3 border flex flex-col gap-2",
                history.status === EQuestionCodeHistoryStatus.CORRECT
                    ? "border-green-500 shadow-green-800"
                    : "border-destructive shadow-destructive"
            )}
        >
            <div className="flex gap-2 flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex-1 overflex-hidden">
                    <p
                        className={cn(
                            "text-sm font-bold",
                            history.status ===
                                EQuestionCodeHistoryStatus.CORRECT
                                ? "text-500"
                                : "text-destructive"
                        )}
                    >
                        {textStatus[history.status]}
                    </p>
                    <p className="text-sm">
                        {dayjs(new Date(history.createdAt))
                            .locale("vi")
                            .format("DD/MM/YYYY HH:mm:ss")}
                    </p>
                </div>
                {!!history.answere && (
                    <div className="flex gap-1">
                        {FunctionsButton.map((funct) => (
                            <Fragment
                                key={
                                    funct.mode +
                                    "function_button_query_history_card"
                                }
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size={"sm"} variant={"outline"}>
                                            {funct.title}
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Select Tabs
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {tabs.map((tab) => (
                                            <DropdownMenuItem
                                                key={
                                                    tab.id +
                                                    "button_query_history_card"
                                                }
                                                asChild
                                            >
                                                <Button
                                                    size={"sm"}
                                                    variant={"ghost"}
                                                    className="w-full justify-start"
                                                    onClick={() => {
                                                        handleAddHistoryToTabCode(
                                                            history.answere,
                                                            funct.mode,
                                                            tab
                                                        );
                                                    }}
                                                >
                                                    {tab.title}
                                                </Button>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>

            <Separator orientation="horizontal" />

            <div className="w-full flex-1 overflow-hidden overflow-y-auto bg-muted rounded p-2">
                {history.answere ? (
                    <code className="w-full h-fit text-sm whitespace-pre-wrap">
                        {history.answere}
                    </code>
                ) : (
                    <p className="text-xs w-full text-center text-destructive font-bold">
                        Empty
                    </p>
                )}
            </div>
        </div>
    );
}
