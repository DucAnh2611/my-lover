import { AuthContext } from "@/context/auth.context";
import { useContext } from "react";

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext not initialized!");
    }

    return context;
}
