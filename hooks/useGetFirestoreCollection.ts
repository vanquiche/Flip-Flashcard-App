import { collection, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useFirestoreQuery } from '@react-query-firebase/firestore';

const useGetFirestoreCollection = (
  path: string,
  queryKey: any[],
  field?: string,
  filter?: string
) => {
  const ref = collection(firestore, path);
  let queryBy;

  if (field !== undefined && filter !== undefined) {
    const q = query(ref, where(field, '==', filter));
    queryBy = query(q, orderBy('createdAt', 'desc'));
  } else {
    queryBy = query(ref, orderBy('createdAt', 'desc'));
  }

  const queries = useFirestoreQuery(queryKey, queryBy);

  return { queries };
};

export default useGetFirestoreCollection;
