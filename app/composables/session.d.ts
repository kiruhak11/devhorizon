import { type IUserSession } from "../../types/session.js";
export declare const useSessionState: () => import("@vue/reactivity").Ref<{}>;
export declare function useUserSession(): IUserSession;
export declare const clearSession: () => Promise<void>;
export declare const fetchSession: () => Promise<void>;
