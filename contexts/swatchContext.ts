import React, { createContext } from "react";
import { defaultTheme, Theme } from "../components/types";

interface Context {
  colors: string[];
  patterns: Record<string, any>,
  theme: Theme
}

const initialValue: Context = {
  colors: [],
  patterns: {},
  theme: defaultTheme
}
const swatchContext = createContext(initialValue)

export default swatchContext