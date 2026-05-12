import { Languages } from "../../types/languages";
import { runPython } from "./runners/python.runner";
import { runJavaScript } from "./runners/javascript.runner";
import { runC } from "./runners/c.runner";
import { runBash } from "./runners/bash.runner";

export const runners = {
  [Languages.PYTHON]: runPython,
  [Languages.JAVASCRIPT]: runJavaScript,
  [Languages.C]: runC,
  [Languages.BASH]: runBash,
};
