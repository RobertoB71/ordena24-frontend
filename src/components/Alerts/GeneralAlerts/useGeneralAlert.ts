import { useContext } from "react";

import { GeneralAlertContext } from "./GeneralAlertContext";

export const useGeneralAlert = () => {
  const context = useContext(GeneralAlertContext);

  if (!context) {
    throw new Error(
      "useGeneralAlert debe usarse dentro de GeneralAlertProvider"
    );
  }

  return context;
};
