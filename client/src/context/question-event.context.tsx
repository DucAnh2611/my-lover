import { TQuestionTree } from "@/types/question";
import { createContext, ReactNode, useState } from "react";

interface IQuestionEventContext {
    questions: TQuestionTree[];
    openDialog: boolean;
    reload: boolean;

    handleOpenDialog: (open: boolean) => void;
    setQuestions: (questions: TQuestionTree[]) => void;
    setReload: (reload: boolean) => void;
}

export const QuestionEventContext = createContext<IQuestionEventContext>({
    openDialog: false,
    questions: [],
    reload: false,

    handleOpenDialog(open) {},
    setQuestions(questions) {},
    setReload() {},
});

export default function QuestionEventProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [questions, SetQuestions] = useState<TQuestionTree[]>([]);
    const [open, SetOpen] = useState<boolean>(false);
    const [reload, SetReload] = useState<boolean>(false);
    const [selected, SetSelected] = useState<number>(-1);

    const setQuestions = (questions: TQuestionTree[]) => {
        SetQuestions(questions);
    };

    const handleOpen = (open: boolean) => {
        SetOpen(open);
    };

    const setReload = (reload: boolean) => {
        SetReload(reload);
    };

    const setSelected = (i: number) => {
        SetSelected(i);
    };

    return (
        <QuestionEventContext.Provider
            value={{
                reload,
                setReload,
                openDialog: open,
                handleOpenDialog: handleOpen,
                questions,
                setQuestions,
            }}
        >
            {children}
        </QuestionEventContext.Provider>
    );
}
