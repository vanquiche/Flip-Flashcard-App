import { IconButton } from 'react-native-paper';

interface Props {
  icon: string;
  color?: string;

}

const TabIcon = ({ icon, color }: Props) => {
  return (
    <IconButton
      icon={icon}
      size={26}
      color={color}
      style={{ marginTop: 5 }}
      accessible
      accessibilityRole='tab'
    />
  );
};

export default TabIcon;
