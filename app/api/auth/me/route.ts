import { NextResponse } from "next/server";

import { authErrorResponse } from "@/lib/auth/http";
import { getCurrentUser } from "@/lib/auth/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return authErrorResponse("Sessao nao autenticada.", 401, "AUTH_UNAUTHORIZED");
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return authErrorResponse("Servidor de autenticacao indisponivel.", 500, "AUTH_SERVER_UNAVAILABLE");
  }
}
