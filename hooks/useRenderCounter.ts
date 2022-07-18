import { useRef } from "react"

const useRenderCounter = () => {
  const renderCount = useRef(0)

  return {
    renderCount
  }
}

export default useRenderCounter