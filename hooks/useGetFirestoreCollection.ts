import { collection, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useFirestoreQuery } from '@react-query-firebase/firestore';

const useGetFirestoreCollection = (path: string, queryKey: any[]) => {
  const ref = collection(firestore, path);
  const queryBy = query(ref, orderBy('createdAt', 'asc'))
  const queries = useFirestoreQuery(queryKey, queryBy);

  return { queries };
};

export default useGetFirestoreCollection;