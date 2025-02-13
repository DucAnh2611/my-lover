import { StorageConfig } from "@/configs/local-str";
import { EEventView } from "@/enums/event";
import {
    EAddHistoryMode,
    EQueryTabType,
    EQuestionStatusRequirement,
} from "@/enums/question";
import useEvent from "@/hook/useEvent";
import useQuestion from "@/hook/useQuestion";
import useQuestionEvent from "@/hook/useQuestionEvent";
import { toast } from "@/hooks/use-toast";
import apiCall from "@/lib/apiCall";
import { cn } from "@/lib/utils";
import { TQuestionTree, TTabData } from "@/types/question";
import { TLocalStorageQuestion } from "@/types/storage";
import { Editor } from "@tinymce/tinymce-react";
import {
    CodeIcon,
    HistoryIcon,
    ListCollapseIcon,
    LoaderIcon,
    PlusIcon,
    ScanTextIcon,
    SendIcon,
} from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QueryTab from "./query-tabs";
import QuestionHistory from "./question-history";
import QuestionResult from "./question-result";
import QuestionSubmitResult from "./question-submit-result";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface IQuestionSolveDialog {
    question: TQuestionTree;
    isLastQuestion?: boolean;
    onPassLastQuestion: () => void;
}

enum ECallingState {
    IDLE = "IDLE",
    CHECK = "CHECK",
    SUBMIT = "SUBMIT",
}

enum ETab {
    QUERY = "QUERY",
    CONTENT = "CONTENT",
    HISTORY = "HISTORY",
}

const MAXIMUM_QUERY_TAB = 4;

export default function QuestionSolveDialog({
    question,
    isLastQuestion = false,
    onPassLastQuestion,
}: IQuestionSolveDialog) {
    const { setStatus } = useEvent();
    const { isCorrectSubmit, setIsCorrectSubmit: SetIsCorrectSubmit } =
        useQuestion();
    const { setReload } = useQuestionEvent();

    const [open, SetOpen] = useState<boolean>(false);
    const [openSubmit, SetOpenSubmit] = useState<boolean>(false);

    const [isStarting, SetIsStarting] = useState<boolean>(false);
    const [isCalling, SetIsCalling] = useState<boolean>(false);
    const [callingState, SetCallingState] = useState<ECallingState>(
        ECallingState.IDLE
    );
    const [tab, SetTab] = useState<ETab>(ETab.CONTENT);

    const [queryTabs, SetQueryTabs] = useState<TTabData[]>([]);
    const [selectedQueryTab, SetSelectedQueryTab] = useState<TTabData | null>(
        null
    );
    const [selectedQuery, SetSelectedQuery] = useState<string>("");

    const handleSelectTab = (t: ETab) => () => {
        SetTab(t);
        SetCallingState(ECallingState.IDLE);
    };

    const startQuestion = async () => {
        if (isStarting) return null;

        SetIsStarting(true);

        const apiCalled = await apiCall({
            method: "POST",
            path: "question/client/:id/start",
            params: {
                id: question.id,
            },
        });

        SetIsStarting(false);

        if (!apiCalled?.success) {
            toast({
                title: "Start failed!",
                description: apiCalled?.message,
            });
            return null;
        }

        SetTab(ETab.CONTENT);
        setStatus(EEventView.ON_SOLVING);

        return true;
    };

    const handleOpenChange = async (open: boolean) => {
        if (!question.canStart) {
            toast({
                title: "Start failed!",
                description: "Can not start, please solve require questions!",
                variant: "destructive",
            });
            return;
        }
        const localStorageQuesData: TLocalStorageQuestion | undefined =
            JSON.parse(localStorage.getItem(StorageConfig.local.ques) || "{}");

        if (open) {
            const start = await startQuestion();
            if (!start) return;

            if (localStorageQuesData) {
                const tabs = localStorageQuesData[question.id];
                const parsedTabs: TTabData[] = JSON.parse(tabs || "[]");
                if (parsedTabs.length) {
                    SetQueryTabs(parsedTabs);
                    SetSelectedQueryTab(parsedTabs[0]);
                } else {
                    handleAddQueryTab(EQueryTabType.MAIN, "Main", true);
                }
            } else {
                handleAddQueryTab(EQueryTabType.MAIN, "Main", true);
            }
        } else {
            setStatus(EEventView.ON_PROGRESS);
            SetQueryTabs([]);
            SetSelectedQueryTab(null);
            SetSelectedQuery("");

            if (localStorageQuesData) {
                localStorage.setItem(
                    StorageConfig.local.ques,
                    JSON.stringify({
                        ...localStorageQuesData,
                        ...(isCorrectSubmit
                            ? {}
                            : {
                                  [question.id]: JSON.stringify(
                                      queryTabs.map((t) => ({
                                          ...t,
                                          result: undefined,
                                          isCorrect: false,
                                          showResult: false,
                                      }))
                                  ),
                              }),
                    } as TLocalStorageQuestion)
                );
            }
            setReload(true);
        }
        SetOpen(open);
    };

    const handleCheck = async () => {
        if (isCalling || !selectedQueryTab) return;

        SetCallingState(ECallingState.CHECK);
        SetIsCalling(true);

        const apiCalled = await apiCall<
            {
                isCorrect: boolean;
                queryResult?: object[];
            },
            any
        >({
            method: "POST",
            path: "question/client/:id/check",
            params: {
                id: question.id,
            },
            body: {
                query: selectedQuery ? selectedQuery : selectedQueryTab.query,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        SetIsCalling(false);
        if (!apiCalled?.success) {
            handeChangeDataQueryTab({
                ...selectedQueryTab,
                showResult: true,
                isCorrect: false,
                result: [],
            });

            toast({
                title: "Failed!",
                description: apiCalled?.message || "Failed!",
                variant: "destructive",
                duration: 1000,
            });
        }

        if (apiCalled?.success) {
            handeChangeDataQueryTab({
                ...selectedQueryTab,
                isCorrect: !!apiCalled?.data?.isCorrect,
                showResult: true,
                result: apiCalled?.data?.queryResult || [],
            });
        }
    };

    const handleSubmit = async () => {
        if (isCalling) return;

        SetCallingState(ECallingState.SUBMIT);
        SetIsCalling(true);

        const apiCalled = await apiCall<
            {
                explain: string | null;
                isCorrect: boolean;
                queryResult?: object[];
            },
            any
        >({
            method: "POST",
            path: "question/client/:id/submit",
            params: {
                id: question.id,
            },
            body: {
                query: queryTabs[0]?.query || "",
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        SetIsCalling(false);

        if (apiCalled?.success) {
            const localStorageQuesData: TLocalStorageQuestion | undefined =
                JSON.parse(
                    localStorage.getItem(StorageConfig.local.ques) || "{}"
                );

            if (localStorageQuesData) {
                let newStorageData: TLocalStorageQuestion =
                    localStorageQuesData;

                if (localStorageQuesData[question.id]) {
                    const {
                        [question.id]: questionData,
                        ...otherQuestionData
                    } = localStorageQuesData;
                    newStorageData = otherQuestionData;
                }

                localStorage.setItem(
                    StorageConfig.local.ques,
                    JSON.stringify({
                        ...newStorageData,
                    } as TLocalStorageQuestion)
                );
            }
            SetIsCorrectSubmit(
                !!apiCalled?.data?.isCorrect,
                apiCalled.data?.explain || ""
            );

            if (isLastQuestion) {
                onPassLastQuestion();
            }
        } else {
            SetIsCorrectSubmit(false);
        }
        SetOpenSubmit(true);
    };

    const handleOpenSubmitResult = (
        o: boolean,
        closeQuestionSolved: boolean = false
    ) => {
        SetOpenSubmit(o);
        if (!o && closeQuestionSolved) {
            handleOpenChange(false);
        }
    };

    const handleAddQueryTab = (
        type: EQueryTabType = EQueryTabType.SUPPORTER,
        title: string = `Untitled Tab`,
        clear: boolean = false
    ) => {
        const newQueryTab: TTabData[] = [
            ...(clear ? [] : queryTabs),
            {
                id: uuidv4(),
                query: "",
                title,
                isCorrect: false,
                showResult: false,
                result: undefined,
                type: type,
            },
        ];

        SetQueryTabs(newQueryTab);

        if (clear) {
            SetSelectedQueryTab(newQueryTab[0]);
        }
    };

    const handleDeleteQueryTab = (tabId: string) => {
        SetQueryTabs((tabs) => tabs.filter((tab) => tab.id !== tabId));
        SetSelectedQueryTab(queryTabs[0]);
    };

    const handleChangeTab = (value: string) => {
        const sTab = queryTabs.find((t) => t.id === value) || null;
        SetSelectedQueryTab(sTab);
        SetSelectedQuery("");

        if (sTab) {
            SetCallingState(ECallingState.CHECK);
        } else {
            SetCallingState(ECallingState.IDLE);
        }
    };

    const handeChangeDataQueryTab = (tabData: TTabData) => {
        if (selectedQueryTab?.id === tabData.id) {
            SetSelectedQueryTab(tabData);
        }
        SetQueryTabs((tabs) =>
            tabs.map((e) => (e.id === tabData.id ? tabData : e))
        );
    };

    const handleSelectQuery = (selectedQuery: string) => {
        SetSelectedQuery(selectedQuery);
    };

    const handleAddHistoryToTabCode = (
        code: string,
        mode: EAddHistoryMode,
        tab: TTabData
    ) => {
        let newTabData = { ...tab };
        let newQuery = "";
        let title = "";

        switch (mode) {
            case EAddHistoryMode.ADD_START:
                newQuery = [
                    `--NEW: ${new Date().toLocaleString()}`,
                    code || "",
                    `${newTabData.query}`,
                ].join("\n");
                title = `Added to start of ${tab.title}!`;
                break;

            case EAddHistoryMode.ADD_END:
                newQuery = [
                    `${newTabData.query}`,
                    `--NEW: ${new Date().toLocaleString()}`,
                    code || "",
                ].join("\n");
                title = `Added to the end of ${tab.title}!`;
                break;

            case EAddHistoryMode.REPLACE:
                newQuery = [
                    `--REPLACED: ${new Date().toLocaleString()}`,
                    code || "",
                ].join("\n");
                title = `Replaced ${tab.title} with new query!`;
                break;

            default:
                return;
        }

        newTabData.query = newQuery;

        handeChangeDataQueryTab(newTabData);
        handleChangeTab(tab.id);
        handleSelectTab(ETab.QUERY)();

        toast({
            title: "Successful!",
            description: title,
            action: (
                <Button
                    size={"sm"}
                    onClick={() => {
                        newTabData.query = tab.query;
                        handeChangeDataQueryTab(newTabData);
                    }}
                >
                    Undo
                </Button>
            ),
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant={"default"}
                    className={cn("w-full")}
                    disabled={!question.canStart}
                >
                    {question.status === EQuestionStatusRequirement.PASS
                        ? question.retriable
                            ? "Try again"
                            : "Passed"
                        : ""}
                    {question.status === EQuestionStatusRequirement.SOLVING
                        ? "Continue"
                        : ""}
                    {question.status === EQuestionStatusRequirement.LOCKED
                        ? "Start"
                        : ""}
                </Button>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "",
                    isCorrectSubmit
                        ? "shadow-2xl shadow-green-500 !border-green-500"
                        : ""
                )}
            >
                <DialogHeader>
                    <DialogTitle>{question.title}</DialogTitle>
                    <DialogDescription>
                        {question.description ||
                            "This question have no description!"}
                    </DialogDescription>
                </DialogHeader>

                <Separator orientation="horizontal" />

                <div className="w-full justify-end flex items-center xl:flex-row flex-col-reverse gap-3">
                    {tab === ETab.QUERY && (
                        <div className="flex-1 flex gap-2">
                            <Button
                                size={"sm"}
                                variant={"outline"}
                                className="gap-1"
                                onClick={handleCheck}
                                disabled={
                                    isCalling &&
                                    callingState === ECallingState.CHECK
                                }
                            >
                                {isCalling &&
                                callingState === ECallingState.CHECK ? (
                                    <LoaderIcon
                                        size={10}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ScanTextIcon size={10} />
                                )}
                                Run{" "}
                                {selectedQuery ? "" : selectedQueryTab?.title}
                            </Button>
                            <Button
                                size={"sm"}
                                variant={"default"}
                                className="gap-1"
                                onClick={handleSubmit}
                                disabled={
                                    isCalling &&
                                    callingState === ECallingState.SUBMIT
                                }
                            >
                                {isCalling &&
                                callingState === ECallingState.SUBMIT ? (
                                    <LoaderIcon
                                        size={10}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <SendIcon size={10} />
                                )}
                                Submit
                            </Button>
                        </div>
                    )}

                    <div className="rounded-md w-fit border border-muted overflow-hidden p-1 flex gap-1">
                        <Button
                            size={"sm"}
                            variant={tab === ETab.CONTENT ? "default" : "ghost"}
                            className="gap-1 rounded-sm px-2 h-[30px] items-center leading-tight"
                            onClick={handleSelectTab(ETab.CONTENT)}
                            key={"select_tab_content"}
                        >
                            <ListCollapseIcon size={10} />
                            Detail
                        </Button>
                        <Button
                            size={"sm"}
                            variant={tab === ETab.QUERY ? "default" : "ghost"}
                            className="gap-1 rounded-sm px-2 h-[30px] items-center leading-tight"
                            onClick={handleSelectTab(ETab.QUERY)}
                            key={"select_tab_query"}
                        >
                            <CodeIcon size={10} />
                            Query
                        </Button>
                        <Button
                            size={"sm"}
                            variant={tab === ETab.HISTORY ? "default" : "ghost"}
                            className="gap-1 rounded-sm px-2 h-[30px] items-center leading-tight"
                            onClick={handleSelectTab(ETab.HISTORY)}
                            key={"select_tab_history"}
                        >
                            <HistoryIcon size={10} />
                            History
                        </Button>
                    </div>
                </div>

                {tab === ETab.QUERY && (
                    <>
                        <div className="w-full flex flex-col gap-2">
                            <div className="w-full h-fit overflow-hidden">
                                <Tabs
                                    onValueChange={handleChangeTab}
                                    value={selectedQueryTab?.id}
                                >
                                    <div className="flex gap-2 items-center">
                                        {queryTabs.length <
                                            MAXIMUM_QUERY_TAB && (
                                            <div>
                                                <Button
                                                    size={"sm"}
                                                    variant={"secondary"}
                                                    className="gap-1"
                                                    onClick={() => {
                                                        handleAddQueryTab();
                                                    }}
                                                >
                                                    <PlusIcon size={10} />
                                                    Add
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <TabsList className="w-fit">
                                                {queryTabs.map((tab) => (
                                                    <TabsTrigger
                                                        key={
                                                            "tab_trigger_question_solve_" +
                                                            question.id +
                                                            "_" +
                                                            tab.id
                                                        }
                                                        value={tab.id}
                                                    >
                                                        <p className="max-w-[45px] text-ellipsis overflow-hidden whitespace-nowrap">
                                                            {tab.title}
                                                        </p>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </div>
                                    </div>
                                    {queryTabs.map((tab) => (
                                        <TabsContent
                                            key={
                                                "tab_content_question_solve_" +
                                                question.id +
                                                "_" +
                                                tab.id
                                            }
                                            value={tab.id}
                                        >
                                            <QueryTab
                                                tabData={tab}
                                                onChange={
                                                    handeChangeDataQueryTab
                                                }
                                                onRemove={handleDeleteQueryTab}
                                                onSelectedCode={
                                                    handleSelectQuery
                                                }
                                            />
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </div>
                        </div>

                        {callingState === ECallingState.CHECK &&
                            selectedQueryTab?.showResult && (
                                <div
                                    className={cn(
                                        "w-full h-fit max-h-[250px] rounded-lg relative bg-background border overflow-x-auto overflow-y-auto whitespace-nowrap p-2",
                                        "shadow-2xl",
                                        selectedQueryTab.isCorrect
                                            ? "border-green-500 shadow-green-800"
                                            : "border-destructive shadow-destructive"
                                    )}
                                >
                                    {!selectedQueryTab?.result ? (
                                        <p className="w-full text-center py-10 text-sm text-muted-foreground">
                                            This query have no result!
                                        </p>
                                    ) : (
                                        <QuestionResult
                                            result={selectedQueryTab?.result}
                                        />
                                    )}
                                </div>
                            )}
                    </>
                )}

                {tab === ETab.CONTENT && (
                    <div className="w-full h-fit max-h-[300px] overflow-hidden overflow-y-auto">
                        {!!question.content.length ? (
                            <Editor
                                tinymceScriptSrc="/tinymce/tinymce.min.js"
                                value={question.content}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    statusbar: false,
                                    plugins: [],
                                    toolbar: [],
                                    skin: "oxide-dark",
                                    content_css: "dark",
                                    editable_root: false,
                                }}
                            />
                        ) : (
                            <div className="w-full py-16 ">
                                <p className="w-full text-center text-xs">
                                    This question doesn't have any content
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {tab === ETab.HISTORY && (
                    <div className="w-full h-fit max-h-[600px] overflow-hidden overflow-y-auto py-2 pr-2 box-border">
                        {!!question?.questionCode?.questionHistory?.length ? (
                            <QuestionHistory
                                tabs={queryTabs}
                                handleAddHistoryToTabCode={
                                    handleAddHistoryToTabCode
                                }
                                histories={
                                    question.questionCode.questionHistory
                                }
                            />
                        ) : (
                            <div className="w-full py-16 ">
                                <p className="w-full text-center text-xs">
                                    You have no history for this question!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <QuestionSubmitResult
                    isOpen={openSubmit}
                    handleOpen={handleOpenSubmitResult}
                />
            </DialogContent>
        </Dialog>
    );
}
