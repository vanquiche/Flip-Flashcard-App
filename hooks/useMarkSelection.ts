import { useRef } from 'react';
// import db from '../db-services'

const useMarkSelection = () => {
  let selection = useRef<string[]>([]).current;

  const selectItem = (item: string, notSelected: boolean) => {
    // if id has not been selected already then pushed to array
    if (notSelected) {
      selection.push(item);
    } else {
      // remove id that has already been selected
      const index = selection.findIndex((id) => id === item);
      selection.splice(index, 1);
    }
  };

  const clearSelection = () => (selection = []);

  return {
    selection,
    selectItem,
    clearSelection,
  };
};

export default useMarkSelection;
