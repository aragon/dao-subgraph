import { ethers } from "ethers";

export async function getLog<R>(
  tx: ethers.ContractTransaction,
  eventName: string,
  argName: string
): Promise<R> {
  const receipt = await tx.wait(0);
  const events = receipt.events || [];
  const event = events.find((e) => e.event === eventName);
  if (!event) throw Error(`No ${eventName} event found`);
  const args = event.args as any;
  if (!args) throw Error(`Event ${eventName} has no args`);
  if (!args[argName]) throw Error(`Event ${eventName} has no arg ${argName}`);
  return args[argName];
}
