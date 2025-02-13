export type TLocalStorage = {
    isLogin: boolean;
    code: number | string;
    questionData?: Record<string, string>;
};

export type TLocalStorageQuestion = Record<string, string>;
