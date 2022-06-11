import { useRef } from "react";

const useSelectColor = () => {
  const swatchColor = useRef<string>('tomato');

  const changeSwatchColor = (c: string) => swatchColor.current = c;

  return {
    swatchColor,
    changeSwatchColor
  }
}

export default useSelectColor