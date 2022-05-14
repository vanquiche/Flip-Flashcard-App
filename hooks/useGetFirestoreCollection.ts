import { collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useFirestoreQuery } from '@react-query-firebase/firestore';

const useGetFirestoreCollection = (path: string, queryKey: any[]) => {
  const ref = collection(firestore, path);
  const query = useFirestoreQuery(queryKey, ref);

  return { query };
};

export default useGetFirestoreCollection;