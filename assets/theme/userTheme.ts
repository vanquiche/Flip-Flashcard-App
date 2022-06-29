import {Theme} from '../../components/types'
import { defaultTheme } from '../../components/types';
const themes: Theme[] = [
  defaultTheme,
  {
    name: 'Sprout',
    cardColor: '#43aa8b',
    fontColor: 'white',
    tabColor: '#0ead69',
    headerColor: '#0ead69',
    bgColor: '#ebf5df',
    iconColor: '#8acb88',
    actionIconColor: '#e4fde1',
    accentColor: '#76c893'
  },
  {
    name: 'Sea Side',
    cardColor: '#5fa8d3',
    fontColor: 'white',
    tabColor: '#0077b6',
    headerColor: '#0077b6',
    bgColor: '#e2eafc',
    iconColor: '#5fa8d3',
    actionIconColor: 'white',
    accentColor: '#82c0cc'
  },
];

export default themes;
