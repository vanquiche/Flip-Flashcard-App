import { collection, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';

const useUpdateDocToFirestore = (path: string, id: string, queryKey: any) => {
  const queryClient = useQueryClient();
  const ref = doc(collection(firestore, path), id);
  const updateMutation = useFirestoreDocumentMutation(
    ref,
    { merge: true },
    {
      onMutate: async (updateItem) => {
        await queryClient.cancelQueries(queryKey);

        const previousData = queryClient.getQueryData<any>(queryKey);

        if (previousData) {
          // add new item to current cached data
          queryClient.setQueryData(
            queryKey,
            Object.assign(previousData, updateItem)
          );
        }
      },
      onError: (error, variables, context: any) => {
        if (context?.previousData) {
          // return to previous cache data on fail
          queryClient.setQueryData(queryKey, context.previousData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  return { updateMutation };
};

export default useUpdateDocToFirestore;
