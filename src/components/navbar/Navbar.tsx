import { Link } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import { useNavbarContext } from "../start-page/NavbarContextUtils";
const ConnectDiscogs = lazy(() => import("../discogs/ConnectDiscogs"));
const ConnectLastFm = lazy(() => import("../lastfm/ConnectLastFm"));

function Navbar() {
  const { navbarButtonRef, triggerClick } = useNavbarContext();

  const handleSearchIconClick = () => {
    // Hide menu
    if (navbarButtonRef.current?.checked) triggerClick();
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-primary px-5 py-5 text-white">
      <ul className="flex flex-row items-center">
        <li className="title relative bottom-[5px] text-[1.5em] font-black uppercase tracking-[-2px] antialiased md:bottom-[17px] md:text-[1.9em]">
          <Link to="/" className="border-0" title="Main page">
            <p className="h-[36px] p-0 pl-[13px] uppercase">Trill</p>
            <p className="h-[36px] p-0 text-[0.8em] uppercase">Music Finder</p>
          </Link>
        </li>

        <li className="ml-auto" onClick={handleSearchIconClick}>
          <Link
            title="Open search"
            to="/search"
            className="mx-2 block scale-100 border-2 border-transparent !bg-transparent p-2 text-white shadow-none transition-all"
          >
            <FaSearch size={25} />
          </Link>
        </li>

        <li className="z-[1] select-none">
          <input
            id="hamburger-toggle"
            aria-controls="hamburger-menu"
            ref={navbarButtonRef}
            type="checkbox"
            className="peer/checkbox absolute z-[2] block h-[32px] w-[40px] cursor-pointer opacity-0"
            tabIndex={0}
            aria-label="Toggle Navigation"
          />

          <label
            htmlFor="hamburger-toggle"
            className="block w-[52px] border-2 border-transparent p-2 transition-all duration-500 peer-checked/checkbox:mr-[9px] peer-checked/checkbox:w-[43px]"
          >
            <span className="relative z-[1] mb-1 mt-1 block h-1 w-8 origin-[4px] rounded-sm bg-white antialiased transition-all duration-500"></span>
            <span className="relative z-[1] mb-1 mt-1 block h-1 w-8 origin-[4px] rounded-sm bg-white antialiased transition-all duration-500"></span>
            <span className="relative z-[1] mb-1 mt-1 block h-1 w-8 origin-[4px] rounded-sm bg-white antialiased transition-all duration-500"></span>
          </label>

          <ul
            id="hamburger-menu"
            className="menu group absolute left-0 top-[110px] flex h-0 w-full list-none flex-col gap-6 overflow-hidden bg-primary px-5 py-0 text-xl text-white antialiased transition-all duration-500 peer-checked/checkbox:h-[210px] peer-checked/checkbox:py-3"
            aria-labelledby="hamburger-toggle"
          >
            <li className="invisible transition-all duration-500 peer-checked/checkbox:group-[.menu]:visible">
              <Suspense fallback={<LoadingAnimation />}>
                <ConnectLastFm />
              </Suspense>
            </li>
            <li className="invisible transition-all duration-500 peer-checked/checkbox:group-[.menu]:visible">
              <Suspense fallback={<LoadingAnimation />}>
                <ConnectDiscogs />
              </Suspense>
            </li>
            <li className="invisible transition-all duration-500 peer-checked/checkbox:group-[.menu]:visible">
              <a
                className="relative mx-2 py-2 text-white after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full"
                href="https://github.com/wulgaren/"
                tabIndex={0}
                target="_blank"
                rel="noreferrer"
              >
                Creator: Natan Wojtyła
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
