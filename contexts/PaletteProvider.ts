import { createContext } from 'react';
import { PaletteProviderType } from '../components/types';

const initialValue: PaletteProviderType = {
  selection: '',
  setColor: () => {},
};

const PaletteContext = createContext(initialValue);

export default PaletteContext;
