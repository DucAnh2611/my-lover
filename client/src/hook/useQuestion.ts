import { QuestionContext } from "@/context/question.context";
import { useContext } from "react";

export default function useQuestion() {
    const questionContext = useContext(QuestionContext);

    if (!questionContext) {
        throw new Error("Question Context is not initialized!");
    }

    return questionContext;
}
