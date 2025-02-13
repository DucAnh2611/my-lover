import { AppConfig } from "@/configs/app";
import { StorageConfig } from "@/configs/local-str";
import {
    TApiCallFailedResponse,
    TApiCallResponse,
    TApiCallSuccessResponse,
} from "@/types/api";

type TApiMethods = "POST" | "PUT" | "GET" | "DELETE";

interface IApiCall {
    method: TApiMethods;
    path: string | string[];
    headers?: Record<string, any>;
    params?: Record<string, string | number>;
    query?: Record<string, string | number>;
    body?: object;
    credentials?: RequestCredentials;
}

const BASE_BACKEND_URL = AppConfig.backend_url;

export default async function apiCall<TS, TF>({
    path,
    method,
    body,
    headers,
    params,
    query,
    credentials = "include",
    ...props
}: IApiCall) {
    try {
        let pathString = "";

        if (typeof path === "object" && Array.isArray(path)) {
            pathString = path.join("/");
        }

        if (typeof path === "string") {
            pathString = path;
        }

        if (!!params) {
            const splitPath = pathString.split("/");

            for (const i in splitPath) {
                let sPath = splitPath[i];
                if (sPath.startsWith(":")) {
                    sPath = sPath.replace(":", "");
                    if (params[sPath]) {
                        splitPath[i] = `${params[sPath]}`;
                    } else {
                        throw new Error(
                            `Attribute "${sPath}" is missing from params object!`
                        );
                    }
                }
            }

            pathString = splitPath.join("/");
        }

        if (!!query) {
            let queries = [];

            for (const entry of Object.entries(query)) {
                const [key, value] = entry;

                queries.push(`${key}=${value}`);
            }

            pathString = `${pathString}?${queries.join("&")}`;
        }

        const apiCall = await fetch(`${BASE_BACKEND_URL}/${pathString}`, {
            method,
            headers: headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
            credentials,
        });

        const json: TApiCallResponse = await apiCall.json();

        if (json.success) {
            return json as TApiCallSuccessResponse<TS>;
        }

        const failedJson = json as TApiCallFailedResponse<TF>;

        if (failedJson.error === "Invalid Token!") {
            localStorage.removeItem(StorageConfig.local.name);
            window.location.reload();
        }

        return failedJson;
    } catch (err) {
        console.log("[API_CALL_THROW]");
        console.log(err);
        return;
    }
}
