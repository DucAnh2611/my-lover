import {
    EQueryTabType,
    EQuestionCodeHistoryStatus,
    EQuestionCodeStatus,
    EQuestionStatusRequirement,
} from "@/enums/question";
import { TEvent } from "./events";

export type TQuestion = {
    id: string;
    retriable: boolean;
    title: string;
    content: string;
    description: string;
    eventId: string;
    no: number;
};

export type TQuestionRequirement = TQuestion & {
    event: TEvent;
    status: EQuestionStatusRequirement;
};
export type TQuestionCode = {
    id: string;
    status: EQuestionCodeStatus;
    questionHistory: TQuestionHistory[];
};

export type TQuestionHistory = {
    id: string;
    status: EQuestionCodeHistoryStatus;
    answere: string;
    createdAt: Date;
};

export type TQuestionTree = TQuestionRequirement & {
    canStart: boolean;
    status: EQuestionStatusRequirement;
    requirement: TQuestionRequirement[];
    questionCode?: TQuestionCode;
};

export type TApiQuestionList = {
    count: number;
    items: TQuestionTree[];
};

export type TTabData = {
    id: string;
    type: EQueryTabType;
    title: string;
    query: string;
    showResult: boolean;
    isCorrect: boolean;
    result: object[] | undefined;
};
