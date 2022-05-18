import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { useQueryClient } from 'react-query';
import { firestore } from '../firebase';

const useAddDocToFirestore = (path: string, queryKey: any) => {
    const queryClient = useQueryClient()

    const ref = collection(firestore, path);
    const addMutation = useFirestoreCollectionMutation(ref, {
        onSuccess: () => {
          alert('successfully added category');
        },
        onError: (error) => {
          alert('Failed: ' + error.message);
        },
        onSettled: () => {
          queryClient.invalidateQueries(queryKey);
        },
      });

    return { addMutation };

};

export default useAddDocToFirestore;
