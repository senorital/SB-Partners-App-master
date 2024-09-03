import { Provider } from "react-redux";
import { store } from "./store/store";
import { useFonts } from "expo-font";
import Main from "./components/main/Main";

export default function App() {
  const [loaded] = useFonts({
    Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
    Poppins_Medium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsBold:require("./assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold:require("./assets/fonts/Poppins-SemiBold.ttf"),
    Poppins_Light:require("./assets/fonts/Poppins-Light.ttf")

  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
