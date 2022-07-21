import { IconButton } from 'react-native-paper';

interface Props {
  icon: string;
  color?: string;
  focused?: boolean;
}

const TabIcon = ({ icon, color, focused }: Props) => {
  return (
    <IconButton icon={icon} size={27} color={color} style={{ marginTop: 5 }} />
  );
};

export default TabIcon;
