import { Languages } from "../../types/languages";
import { runPython } from "./python.runner";
import { runJavaScript } from "./javascript.runner";

export const runners = {
  [Languages.PYTHON]: runPython,
  [Languages.JAVASCRIPT]: runJavaScript,
};