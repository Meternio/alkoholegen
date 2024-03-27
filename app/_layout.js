import { Slot } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#65120c",
    secondary: "#041a20",
  },
};

export default function MainLayout() {
  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}
