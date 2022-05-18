import { collection, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';

const useUpdateDocToFirestore = (path: string, id: string, queryKey: any) => {
  const queryClient = useQueryClient();
  const ref = doc(collection(firestore, path), id);
  const updateMutation = useFirestoreDocumentMutation(ref, { merge: true }, {
     onSuccess: () => {
        alert('successfully updated category');
      },
      onError: (error) => {
        alert('Failed: ' + error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
  });

  return { updateMutation };
};

export default useUpdateDocToFirestore;
