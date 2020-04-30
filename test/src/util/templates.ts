import fs from "fs";
import Mustache from "mustache";

export function renderTemplate(
  fromPath: string,
  toPath: string,
  config: { [key: string]: any }
) {
  const from = fs.readFileSync(fromPath, "utf8");
  const result = Mustache.render(from, config);
  fs.writeFileSync(toPath, result);
}
