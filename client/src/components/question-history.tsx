import { EAddHistoryMode } from "@/enums/question";
import { TQuestionHistory, TTabData } from "@/types/question";
import QuestionHistoryCard from "./question-history-card";

interface IQuestionHistoryProps {
    histories: TQuestionHistory[];
    tabs: TTabData[];
    handleAddHistoryToTabCode: (
        code: string,
        mode: EAddHistoryMode,
        tab: TTabData
    ) => void;
}

export default function QuestionHistory({
    histories,
    handleAddHistoryToTabCode,
    tabs,
}: IQuestionHistoryProps) {
    return (
        <div className="w-full h-fit flex flex-col-reverse gap-2">
            {histories.map((history) => (
                <div key={history.id}>
                    <QuestionHistoryCard
                        history={history}
                        tabs={tabs}
                        handleAddHistoryToTabCode={handleAddHistoryToTabCode}
                    />
                </div>
            ))}
        </div>
    );
}
