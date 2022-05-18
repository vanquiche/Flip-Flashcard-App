import { collection, doc } from 'firebase/firestore';
import { useFirestoreDocumentDeletion } from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';
import { firestore } from '../firebase';

const useDeleteDocFromFirestore = (
  path: string,
  docId: string,
  queryKey: any
) => {
  const queryClient = useQueryClient();
  const ref = doc(collection(firestore, path), docId);
  const deleteMutation = useFirestoreDocumentDeletion(ref, {
    onMutate: async () => {
      const previousData = queryClient.getQueryData<any>(queryKey);

      return { previousData };
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
  });

  return { deleteMutation };
};

export default useDeleteDocFromFirestore;
