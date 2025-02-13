import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-one_dark";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import AuthContextProvider from "./context/auth.context";
import EventProvider from "./context/event.context";
import QuestionEventProvider from "./context/question-event.context";
import QuestionProvider from "./context/question.context";
import AppRouter from "./routes";

function App() {
    const setTheme = () => {
        const bodies = document.getElementsByTagName("body");
        if (!bodies?.length) return;

        bodies[0].className = "dark";
    };

    useEffect(() => {
        setTheme();
    }, []);

    return (
        <div
            className={`w-[100dvw] h-fit min-h-[100dvh] bg-background text-foreground font-sans overflow-x-hidden overflow-y-auto `}
        >
            <AuthContextProvider>
                <EventProvider>
                    <QuestionEventProvider>
                        <QuestionProvider>
                            <AppRouter />
                        </QuestionProvider>
                    </QuestionEventProvider>
                </EventProvider>
            </AuthContextProvider>
            <Toaster />
        </div>
    );
}

export default App;
