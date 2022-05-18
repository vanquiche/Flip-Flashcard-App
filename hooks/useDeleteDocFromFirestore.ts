import { collection, doc } from 'firebase/firestore';
import { useFirestoreDocumentDeletion } from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';
import { firestore } from '../firebase';

const useDeleteDocFromFirestore = (path: string, docId: string, queryKey: any) => {
  const queryClient = useQueryClient()
  const ref = doc(collection(firestore, path), docId);
  const deleteMutation = useFirestoreDocumentDeletion(ref, {
    onMutate: () => {
      console.log(docId);
      
    },
    onSuccess: () => {
    console.log('sucess')
    },
    onError: (error) => {
      alert('Failed: ' + error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey)
      console.log('settled');

      alert('sucessfully delete')
    }
  });

  return { deleteMutation };
};

export default useDeleteDocFromFirestore;
