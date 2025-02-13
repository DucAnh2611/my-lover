import { QuestionEventContext } from "@/context/question-event.context";
import { useContext } from "react";

export default function useQuestionEvent() {
    const questionEvent = useContext(QuestionEventContext);

    if (!questionEvent) {
        throw new Error("Question Event context is not initialized!");
    }

    return questionEvent;
}
