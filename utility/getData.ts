import db from '../db-services';
import { Action } from '../reducers/CardReducer';

const getData = (query: any, cb: (data: Action) => void) => {
  db.find(query, async (err: Error, docs: any[]) => {
    const data = await docs.map((doc: any) => {
      // convert date to number
      doc.createdAt = new Date(doc.createdAt).valueOf();
      return doc;
    });
    // sort by date
    const sorted = data.sort((a: any, b: any) => {
      return b.createdAt - a.createdAt;
    });
    cb({ type: 'restore', payload: sorted });
  });
};

export default getData;
