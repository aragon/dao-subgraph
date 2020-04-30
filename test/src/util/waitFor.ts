import waitPort from "wait-port";
import { URL } from "url";
import { ethers } from "ethers";
import retry from "async-retry";

export async function waitForUrl(url: string) {
  await waitPort({
    host: new URL(url).hostname,
    port: parseInt(new URL(url).port) || 80,
  });
}

export async function waitForMs(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function waitForTestnet(url: string, timeout = 30 * 1000) {
  const provider = new ethers.providers.JsonRpcProvider(url);
  await retry(
    async () =>
      provider.getBlockNumber().catch((e) => {
        console.log(`Waiting for testnet to be live...\n${e.message}`);
        throw e;
      }),
    { maxRetryTime: timeout }
  );
}
