import React from "react";
import { useMutation } from "@apollo/client";
import { CHECK_VALID_TOKEN, LOGIN, LOGOUT } from "@/graphql-client/gql-user";
import { dispatch, useSelector } from "@/store";
import { loginAction, logoutAction } from "@/store/slices/accountSlice";
import IUser from "@/types/user-profile";
import JWTContext from "@/contexts/jwt-context";
const JWTProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.account);
  const [loginUser] = useMutation(LOGIN);
  const [logoutUser] = useMutation(LOGOUT);
  const [checkValidTokenUser] = useMutation(CHECK_VALID_TOKEN);
  React.useEffect(() => {
    const init = async () => {
      try {
        let isValid: boolean = true;
        const token: string = window.localStorage.getItem("accessToken")
          ? (window.localStorage.getItem("accessToken") as string)
          : "";
        if (!token) {
          isValid = false;
        } else {
          const res = await checkValidTokenUser({ variables: { token } });
          if (res && res.data && res.data.checkValidToken) {
            const { status, item } = res.data.checkValidToken;
            if (!status) {
              isValid = false;
            } else {
              const user: IUser = item;
              window.localStorage.setItem("accessToken", token);
              dispatch(loginAction(user));
            }
          }
        }
        if (!isValid) {
          window.localStorage.removeItem("accessToken");
          dispatch(logoutAction());
        }
      } catch (err: any) {
        console.log("err = ", err.message);
      }
    };
    init();
  }, []);
  const login = async (username: string, password: string) => {
    let isValid: boolean = true;
    const res = await loginUser({
      variables: {
        username,
        password
      }
    });
    if (res && res.data && res.data.login) {
      const { status, item } = res.data.login;
      if (!status) {
        isValid = false;
      } else {
        const { _id, email, displayName, token } = item;
        const user: IUser = { _id, username, email, displayName };
        window.localStorage.setItem("accessToken", token);
        dispatch(loginAction(user));
      }
    }
    if (!isValid) {
      window.localStorage.removeItem("accessToken");
      dispatch(logoutAction());
    }
  };
  const logout = async (id: string) => {
    const res = await logoutUser({ variables: { id } });
    if (res && res.data && res.data.logout) {
      const { status } = res.data.logout;
      if (status) {
        window.localStorage.removeItem("accessToken");
        dispatch(logoutAction());
      }
    }
  };
  return (
    <JWTContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </JWTContext.Provider>
  );
};
export default JWTProvider;
