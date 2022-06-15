import React, { createContext, SetStateAction } from "react";
interface Context {
  color:string;
  setColor: React.Dispatch<SetStateAction<string>>
}

const initialValue: Context = {
  color: '',
  setColor: () => {}
}
const swatchContext = createContext(initialValue)

export default swatchContext