export type TEvent = {
    id: string;
    name: string;
    description: string;
    start: Date;
    end: Date | null;
    isEntry: boolean;
};

export type TEventDetail = TEvent & {
    data: any | null;
    quesCount: number;
    quesPassCount: number;
    canTakePrize: boolean;
};

export type TEventCode = {
    id: string;
    data: any | null;
    codeId: string;
    eventId: string;
};

export type TSApiEventList = {
    count: number;
    items: TEvent[];
};
