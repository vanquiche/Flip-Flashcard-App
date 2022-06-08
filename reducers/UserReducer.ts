import { User } from '../components/types';
import db from '../db-services';

export interface UserAction {
  type: 'set user' | 'create user' | 'delete user' | 'set login' | 'set points' | 'set xp';
  payload: any;
}

const setUser = (action: UserAction) => {
  return action.payload;
};

const setLogin = (state: User, action: UserAction) => {
  const updatedState = Object.assign(state, action.payload)
  return updatedState;
}

export const userReducer = (state: User, action: UserAction): User => {
  switch (action.type) {
    case 'create user':
      return setUser(action);
    case 'set user':
      return setUser(action);
    case 'set login':
      return setLogin(state, action)
    default:
      return state;
  }
};
