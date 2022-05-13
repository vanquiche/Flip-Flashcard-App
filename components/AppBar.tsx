import { Appbar, useTheme } from 'react-native-paper';

const AppBar = ({ navigation, route, back }: any) => {
  const { colors } = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: colors.primary, elevation: 0 }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  );
};

export default AppBar;
