"use client";

import React, { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOut: FC<SignOutProps> = ({ ...props }) => {
  const [isSignOut, setSignOut] = useState<boolean>(false);
  return (
    <Button
      {...props}
      onClick={async () => {
        setSignOut(true);
        try {
          await signOut();
        } catch (error) {
          console.log(error);
        } finally {
          setSignOut(false);
        }
      }}
    >
      {isSignOut ? (
        <FontAwesomeIcon icon={faSpinner} className="h-4  w-4 animate-spin" />
      ) : (
        <abbr title="sign out">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
        </abbr>
      )}
    </Button>
  );
};

export default SignOut;
