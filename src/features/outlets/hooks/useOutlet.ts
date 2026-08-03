import { useContext } from "react";
import { OutletContext } from "../context/OutletContext";

export function useOutlet() {
  const context = useContext(OutletContext);

  if (!context) {
    throw new Error("useOutlet must be used within OutletProvider");
  }

  return context;
}
