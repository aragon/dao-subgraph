import { exec, ChildProcess, ExecOptions } from "child_process";

export function shell(
  command: string,
  options?: ExecOptions & { pipeOutput?: boolean }
) {
  return new Promise((resolve, reject) => {
    const child = exec(command, options, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
    if (options && options.pipeOutput) pipeOutput(child);
  });
}

export function waitToExit(child: ChildProcess) {}

export function pipeOutput(child: ChildProcess): void {
  if (child.stdout) child.stdout.pipe(process.stdout);
  if (child.stderr) child.stderr.pipe(process.stderr);
}
