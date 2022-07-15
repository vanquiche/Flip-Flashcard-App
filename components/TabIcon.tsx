import { IconButton } from 'react-native-paper';

const TabIcon = (props: { icon: string; color?: string }) => {
  return (
    <IconButton
      icon={props.icon}
      size={27}
      color={props.color}
      style={{ marginTop: 5 }}
    />
  );
};

export default TabIcon;
