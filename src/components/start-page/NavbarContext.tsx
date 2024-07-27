import { ReactElement, useRef, useState } from "react";
import { NavbarContext } from "./NavbarContextUtils";

export const ClickProvider = ({ children }: { children: ReactElement[] }) => {
  const navbarButtonRef = useRef<HTMLInputElement>(null);
  const [discogsUsername, setDiscogsUsername] = useState("");
  const [lastFmUsername, setLastFmUsername] = useState(
    localStorage.lastFmUsername ?? "",
  );

  const triggerClick = () => {
    if (navbarButtonRef.current) {
      navbarButtonRef.current.click();
    }
  };

  return (
    <NavbarContext.Provider
      value={{
        navbarButtonRef,
        triggerClick,
        discogsUsername,
        setDiscogsUsername,
        lastFmUsername,
        setLastFmUsername,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
