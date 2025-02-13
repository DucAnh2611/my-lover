import { TQuestionTree } from "@/types/question";
import { createContext, ReactNode, useState } from "react";

interface IQuestionContext {
    question: TQuestionTree | null;
    isCorrectSubmit: boolean;
    isCorrectCheck: boolean;
    explain: string;

    setIsCorrectSubmit: (isCorrect: boolean, explain?: string) => void;
    setIsCorrectCheck: (isCorrect: boolean) => void;
    setQuestion: (question: TQuestionTree | null) => void;
}

export const QuestionContext = createContext<IQuestionContext>({
    question: null,
    isCorrectSubmit: false,
    isCorrectCheck: false,
    explain: "",

    setIsCorrectSubmit(isCorrect: boolean, explain?: string) {},
    setIsCorrectCheck(isCorrect: boolean) {},
    setQuestion(question: TQuestionTree | null) {},
});

export default function QuestionProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [question, SetQuestion] = useState<TQuestionTree | null>(null);
    const [isCorrectSubmit, SetIsCorrectSubmit] = useState<boolean>(false);
    const [isCorrectCheck, SetIsCorrectCheck] = useState<boolean>(false);
    const [explain, SetExplain] = useState<string>("");

    const setIsCorrectSubmit = (c: boolean, ex?: string) => {
        SetIsCorrectSubmit(c);
        if (c && !!ex?.length) {
            SetExplain(ex);
        } else {
            SetExplain("");
        }
    };

    const setIsCorrectCheck = (c: boolean) => {
        SetIsCorrectCheck(c);
    };

    const setQuestion = (q: TQuestionTree | null = null) => {
        SetQuestion(q);
        setIsCorrectCheck(false);
        setIsCorrectSubmit(false);
        SetExplain("");
    };

    return (
        <QuestionContext.Provider
            value={{
                question,
                isCorrectCheck,
                isCorrectSubmit,
                explain,
                setIsCorrectCheck,
                setIsCorrectSubmit,
                setQuestion,
            }}
        >
            {children}
        </QuestionContext.Provider>
    );
}
