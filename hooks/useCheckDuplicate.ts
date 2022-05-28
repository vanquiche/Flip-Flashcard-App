import { useState } from 'react';

const useCheckDuplicate = async (
  name: string,
  reference: string,
  array: any[]
) => {
  const [alreadExist, setAlreadyExist] = useState(null);

  const state = await array.find((item) => item[reference] === name);

  setAlreadyExist(state);

  return {
    alreadExist,
  };
};

export default useCheckDuplicate;
