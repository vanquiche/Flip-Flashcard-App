import {
  useFirestoreCollectionMutation
} from '@react-query-firebase/firestore';
import { collection } from 'firebase/firestore';
import { useQueryClient } from 'react-query';
import { firestore } from '../firebase';


const useAddDocToFirestore = (path: string, queryKey: any) => {
  const queryClient = useQueryClient();

  const ref = collection(firestore, path);
  const addMutation = useFirestoreCollectionMutation(ref, {
    onMutate: async (newData) => {
      // cancel outgoing query
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData<any>(queryKey);

      if (previousData) {
        // add new item to current cached data
        queryClient.setQueryData(queryKey, Object.assign(previousData, newData));
      }

      return { previousData };
    },
    onError: (error, variables, context: any) => {
      alert('Failed: ' + error.message);
      if (context?.previousData) {
        // return to previous cache data on fail
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // fetch server after settling operation regardeless success or error
      queryClient.invalidateQueries(queryKey);
    },
  });

  return { addMutation };
};

export default useAddDocToFirestore;
