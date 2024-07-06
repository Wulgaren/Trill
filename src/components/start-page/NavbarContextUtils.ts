import { createContext, useContext } from "react";

interface NavbarContextType {
  navbarButtonRef: React.RefObject<HTMLInputElement>;
  triggerClick: () => void;
  discogsUsername: string;
  lastFmUsername: string;
  setDiscogsUsername: React.Dispatch<React.SetStateAction<string>>;
  setLastFmUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const NavbarContext = createContext<NavbarContextType>(
  {} as NavbarContextType,
);

export const useNavbarContext = () => useContext(NavbarContext);
