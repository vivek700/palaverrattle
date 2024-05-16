"use client";

import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileNav = ({ children }: { children: React.ReactNode }) => {
  const [toggleNav, setToggleNav] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setToggleNav(false);
  }, [pathname]);

  const navHandler = () => {
    setToggleNav((prev) => !prev);
  };

  useEffect(() => {
    if (toggleNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [toggleNav]);
  //className="hidden flex-1 flex-col md:flex"

  return (
    <>
      <nav className=" flex md:hidden ">
        {toggleNav ? (
          <span onClick={navHandler}>
            <FontAwesomeIcon icon={faX} className="h-8 w-8" />
          </span>
        ) : (
          <span onClick={navHandler}>
            <FontAwesomeIcon icon={faBars} className="h-8 w-8" />
          </span>
        )}
        {toggleNav && (
          <section className=" absolute inset-y-0 left-0 z-10 bg-slate-900">
            {children}
          </section>
        )}
      </nav>
    </>
  );
};

export default MobileNav;
