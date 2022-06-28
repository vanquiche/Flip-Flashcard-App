import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  cardButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 75,
    paddingHorizontal: 15,
  },
  cardActionButton: {
    marginVertical: 10,
    height: 50,
    elevation: 0,
    justifyContent: 'center',
  },
  cardListContainer: {
    paddingBottom: 150,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionDialogChildrenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
