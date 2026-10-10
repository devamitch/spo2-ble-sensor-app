import { Home, Settings } from "lucide-react-native";

export const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Home color={color} size={size} />
);

export const SettingsIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <Settings color={color} size={size} />;
