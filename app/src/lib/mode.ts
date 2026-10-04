export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "sandbox";
export const IS_SANDBOX = APP_MODE !== "production";
