import waitPort from "wait-port";
import { URL } from "url";

export async function waitForUrl(url: string) {
  await waitPort({
    host: new URL(url).hostname,
    port: parseInt(new URL(url).port) || 80,
  });
}

export async function waitForMs(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
