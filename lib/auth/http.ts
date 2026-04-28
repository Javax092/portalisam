import { NextResponse } from "next/server";

export type AuthErrorCode =
  | "AUTH_BAD_REQUEST"
  | "AUTH_UNAUTHORIZED"
  | "AUTH_FORBIDDEN"
  | "AUTH_CONFIG_ERROR"
  | "AUTH_SERVER_UNAVAILABLE";

export function authErrorResponse(message: string, status: number, code: AuthErrorCode) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      message,
    },
    { status },
  );
}
