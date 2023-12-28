"client";
import { useEffect, useState } from "react";

import { api } from "@/network";

export const useLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

  const callAuth = async () => {
    try {
      await api.fetchWithAuthentication(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/authenticate"
      );

      setIsLoggedIn(true);
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    callAuth();
  }, []);

  return isLoggedIn;
};
