import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '../firebase';

const useSetDocToFirestore = (path: string) => {
  const ref = collection(firestore, path);
  const mutation = useFirestoreCollectionMutation(ref);

  return { mutation };
};

export default useSetDocToFirestore;
