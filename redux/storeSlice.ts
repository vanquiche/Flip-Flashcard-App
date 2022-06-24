import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initUser,
  User,
  Set,
  Category,
  Flashcard,
  Collection,
} from '../components/types';
import {
  addCategoryCard,
  addFlashCard,
  addSetCard,
  getCards,
  getFavoriteSets,
  removeCard,
  updateCard,
} from './cardThunkActions';
import {
  createNewUser,
  deleteUser,
  getUserData,
  updateUser,
  checkLogin,
  completeQuiz
} from './userThunkActions';

interface StoreInit {
  user: User;
  loading: boolean;
  notification: {
    show: boolean;
    message: string;
  };
  favoriteSets: Set[];
  cards: {
    category: Category[];
    set: Set[];
    flashcard: Flashcard[];
  };
}

const initialState: StoreInit = {
  user: initUser,
  loading: false,
  notification: {
    show: false,
    message: '',
  },
  favoriteSets: [],
  cards: {
    category: [],
    set: [],
    flashcard: [],
  },
};

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    dismissNotification: (state) => {
      state.notification.show = false;
      state.notification.message = '';
    },
    showNotification: (state, action: PayloadAction<string>) => {
      state.notification.show = true;
      state.notification.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // console.log(action.payload)
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        // console.log(action.payload)
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        Object.assign(state.user, action.payload);
      })
      .addCase(deleteUser.fulfilled, () => {
        return initialState;
      })
      .addCase(addCategoryCard.fulfilled, (state, action) => {
        state.cards.category.unshift(action.payload);
      })
      .addCase(addSetCard.fulfilled, (state, action) => {
        state.cards.set.unshift(action.payload);
        state.favoriteSets.push(action.payload);
      })
      .addCase(addFlashCard.fulfilled, (state, action) => {
        state.cards.flashcard.unshift(action.payload);
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        return {
          ...state,
          // remove category cards and its children
          cards: {
            category: state.cards.category.filter(
              (c) => c._id !== action.payload.id
            ),
            set: state.cards.set.filter((s) => s._id !== action.payload.id),
            flashcard: state.cards.flashcard.filter(
              (f) => f._id !== action.payload.id
            ),
          },
          // update favorite sets list
          favoriteSets: state.favoriteSets.filter(
            (f) => f._id !== action.payload.id
          ),
        };
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        if (action.payload.type) {
          const key = action.payload.type;
          let updateFavs;

          // update cards by card type i.e. 'category', 'set', 'flashcard'
          const updatedCards = state.cards[key].map((c: Collection) => {
            if (c._id === action.payload.id) {
              return { ...c, ...action.payload.query };
            }
            return c;
          });

          // update favorite section
          if (key === 'set') {
            updateFavs = state.favoriteSets.map((f) => {
              if (f._id === action.payload.id) {
                return { ...f, ...action.payload.query };
              }
              return f;
            });
          } else updateFavs = state.favoriteSets;

          return {
            ...state,
            cards: {
              ...state.cards,
              [key]: updatedCards,
            },
            favoriteSets: updateFavs as Set[],
          };
        } else return state;
      })
      .addCase(getCards.fulfilled, (state, action) => {
        const key = action.payload.type;
        return {
          ...state,
          cards: {
            ...state.cards,
            [key]: action.payload.cards,
          },
        };
      })
      .addCase(getFavoriteSets.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.favoriteSets = action.payload;
        } else return state;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.user.login.push(action.payload);
        }
      })
      .addCase(completeQuiz.fulfilled, (state, action) => {
        state.user.completedQuiz.push(action.payload);
      });
  },
});

export const { dismissNotification, showNotification } = storeSlice.actions;

export default storeSlice.reducer;
