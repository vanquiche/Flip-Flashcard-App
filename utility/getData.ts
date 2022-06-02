import db from '../db-services';

const getData = (query: any, cb: (data: any) => void) => {
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
    cb(sorted);
  });
};

export default getData;
