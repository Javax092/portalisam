const SERVICE_WORKER_PATH = "/sw.js";

function isServiceWorkerSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production" || !isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH, {
      scope: "/",
    });

    registration.update().catch(() => undefined);
  } catch {
    // O registro falha silenciosamente para nao afetar a navegacao normal.
  }
}
