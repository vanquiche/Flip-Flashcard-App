import { LayoutChangeEvent } from 'react-native';
import { CardPosition, Collection } from '../components/types';
import db from '../db-services';

export const createPositionList = (data: Collection[]) => {
  const obj: Record<string, number> = {};

  for (let i = 0; i < data.length; i++) {
    obj[data[i]._id] = i;
  }
  return obj;
};

export const moveObject = (
  list: Record<string, number>,
  from: number,
  to: number
) => {
  'worklet';
  // create a new copy of list
  const newList = Object.assign({}, list);

  for (const id in list) {
    if (list[id] === from) {
      newList[id] = to;
    }

    if (list[id] === to) {
      newList[id] = from;
    }
  }
  return newList;
};

export const removeFromPositions = (
  list: Record<string, number>,
  id: string
) => {
  'worklet';
  const newList: Record<string, number> = {};
  const ref = list[id];
  for (const [key, val] of Object.entries(list)) {
    if (val > ref) {
      newList[key] = val - 1;
    } else if (val === ref) {
      continue;
    } else {
      // position remains the same
      newList[key] = val;
    }
  }
  return newList;
};

export const removeManyFromPositions = (
  list: Record<string, number>,
  ids: string[]
) => {
  'worklet';
  const copyList = Object.assign({}, list);
  const keys = Object.keys(copyList);
  // remove selected items from list
  for (let i = 0; i < ids.length; i++) {
    if (keys.includes(ids[i])) {
      const item = keys.find((k) => k === ids[i]);
      if (item) delete copyList[item];
    }
  }

  return reOrderList(copyList);
};

function reOrderList(list: Record<string, number>) {
  'worklet';
  const obj: Record<string, number> = {};
  // reorder list from lowest to heighest value
  const reorder: Record<string, number> = Object.fromEntries(
    Object.entries(list).sort(([, a], [, b]) => a - b)
  );
  let count = 0;
  for (const key in reorder) {
    obj[key] = count;
    count = count + 1;
  }
  return obj;
}

export const addToPositions = (list: Record<string, number>, id: string) => {
  'worklet';
  const newList: Record<string, number> = { [id]: 0 };
  for (const [key, val] of Object.entries(list)) {
    newList[key] = val + 1;
  }
  return newList;
};

export const measureOffset = (
  e: LayoutChangeEvent,
  callback: (offset: number) => void
) => {
  callback(e.nativeEvent.layout.y);
};

export const getCardPosition = (id: string) => {
  return new Promise<CardPosition>((resolve, reject) =>
    db.findOne(
      { type: 'position', ref: id },
      (err: Error, doc: CardPosition) => {
        if (!err) resolve(doc);
        else reject(null);
      }
    )
  );
};

export const saveCardPosition = (obj: CardPosition) => {
  // 'worklet';
  db.count({ type: 'position', ref: obj.ref }, (err: Error, count: number) => {
    if (count > 0) {
      db.update(
        { type: 'position', ref: obj.ref },
        { $set: { positions: obj.positions } }
      );
    } else {
      db.insert(obj, (err: Error, doc: any) => {
        if (err) console.log(err);
      });
    }
  });
};

export const deleteChildPosition = (id: string) => {
  'worklet';
  db.remove(
    { type: 'position', root: id },
    { multi: true },
    (err: Error, numRemoved: number) => {
      if (err) console.log(err);
      console.log('child positions removed: ' + numRemoved);
    }
  );
};

export const multiDeleteChildPosition = (ids: string[]) => {
  'worklet';
  // let removed = 0;
  for (let i = 0; i < ids.length; i++) {
    db.remove(
      { type: 'position', root: ids[i] },
      { multi: true },
      (err: Error, numRemoved: number) => {
        // if (numRemoved) removed += numRemoved;
        console.log(numRemoved)
      }
    );
  }
};
