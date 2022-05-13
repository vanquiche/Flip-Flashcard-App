import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebase = initializeApp({
  apiKey: 'AIzaSyBfeO_-Tg6nNiXHLX3ZMF16Swo4-p5YcYc',
  authDomain: 'swr-firestore-test.firebaseapp.com',
  projectId: 'swr-firestore-test',
  storageBucket: 'swr-firestore-test.appspot.com',
  messagingSenderId: '206185178460',
  appId: '1:206185178460:web:e00249ed86847fa09e4d99',
});

export const firestore = getFirestore(firebase);
