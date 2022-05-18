import { Appbar, useTheme } from 'react-native-paper';

const AppBar = ({ navigation, route, back }: any) => {
  const { colors } = useTheme();

  return (
    <Appbar.Header style={{ elevation: 0 }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} titleStyle={{ fontSize: 20 }} />
    </Appbar.Header>
  );
};

export default AppBar;
