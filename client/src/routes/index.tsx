import AuthPage from "@/pages/auth";
import EditorPage from "@/pages/editor";
import MainPage from "@/pages/main";
import LayoutMain from "@/pages/main/layout";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./private";

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<LayoutMain />}>
                    <Route path="/" element={<MainPage />}></Route>
                </Route>
            </Route>
            <Route path="/editor" element={<EditorPage />}></Route>
            <Route path="/auth" element={<AuthPage />}></Route>
        </Routes>
    );
}
