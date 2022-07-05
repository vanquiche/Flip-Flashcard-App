import React, { createContext } from "react";

interface Context {
  colors: string[];
  patterns: Record<string, any>
}

const initialValue: Context = {
  colors: [],
  patterns: {}
}
const swatchContext = createContext(initialValue)

export default swatchContext