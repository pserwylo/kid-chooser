import {createHashRouter} from "react-router-dom";
import Splash from "../pages/Splash.tsx";
import Chooser from "../pages/chooser/Chooser.tsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <Splash />
  },
  {
    path: "/choose/:chooserSlug",
    element: <Chooser />
  }
]);