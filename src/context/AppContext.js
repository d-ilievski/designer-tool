import { createContext, useContext } from "react";
import { SelectionTypes } from "../utils/types";
import templates from "../utils/templates";
import { useActions } from "./actions";

const AppContext = createContext(null);

const initialState = {
  canvas: null,
  canvasElement: null,
  canvasWrapperElement: null,
  canvasArtboard: null,
  canvasArtboardGuidelinesImage: null,
  canvasHorizontalCenterGuideline: null,
  canvasVerticalCenterGuideline: null,
  canvasGreyOverlay: null,
  canvasMinimumScaleFactor: 1,
  canvasMaximumScaleFactor: 1,
  canvasCurrentScaleFactor: 1,
  canvasArtboardRotation: "vertical",
  canvasBackgroundColor: "#fff",
  canvasLayers: [],
  templates,
  currentTemplate: templates[0].value,
  activeObject: {
    type: SelectionTypes.None,
    fontFamily: "Roboto",
    fontStyles: [],
    textAlign: "left",
    fill: "#000",
    textBackgroundColor: "",
    scale: 1.5,
  },
};

export const AppContextProvider = (props) => {
  const { state, setState, actions } = useActions(initialState);

  return (
    <AppContext.Provider value={{ state, setState, actions }}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
