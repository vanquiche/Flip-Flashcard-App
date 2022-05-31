import { useRef } from 'react';
// import db from '../db-services'

const useMarkSelection = () => {
  const selection = useRef<string[]>([]);

  const selectItem = (item: string, notSelected: boolean) => {
    // if id has not been selected already then pushed to array
    if (notSelected) {
      selection.current.push(item);
    } else {
      // remove id that has already been selected
      const index = selection.current.findIndex((id) => id === item);
      selection.current.splice(index, 1);
    }
    // console.log(selection)
  };

  const clearSelection = () => {
    selection.current = [];
  };


  return {
    selection,
    selectItem,
    clearSelection,
  };
};

export default useMarkSelection;
