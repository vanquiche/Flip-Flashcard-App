import { useCallback, useState } from 'react';
// import db from '../db-services'

const useMarkSelection = () => {
  const [selection, setSelection] = useState<string[]>([]);

  const selectItem = useCallback((item: string, notSelected: boolean) => {
    // if id has not been selected already then pushed to array
    if (notSelected) {
      setSelection(prev => [...prev, item])
    } else {
      // remove id that has already been selected
      setSelection(prev => prev.filter(i => i !== item))
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelection([])
  }, [])


  return {
    selection,
    selectItem,
    clearSelection,
  };
};

export default useMarkSelection;
