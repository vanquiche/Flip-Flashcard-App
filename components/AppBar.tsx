import { Appbar, useTheme } from 'react-native-paper';

const AppBar = ({ navigation, route, back, title }: any) => {
  const { colors } = useTheme();

  return (
    <Appbar.Header style={{ elevation: 0 }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content
        title={title || route.name.toUpperCase()}
        titleStyle={{ fontSize: 20, color: colors.secondary }}
      />
    </Appbar.Header>
  );
};

export default AppBar;
