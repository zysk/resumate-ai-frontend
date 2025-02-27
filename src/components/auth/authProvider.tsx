import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AlertColor } from "@mui/material";

interface SnackMessageProps {
  msg: string;
  color: AlertColor;
}

interface IProvider {
    user: any;
    setUser: any;
    login: (data: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
    setLoading: any;
    snackOpen: boolean;
    setSnackOpen: any;
    message: any;
    setMessage: any;
}
const AuthContext = createContext<IProvider>({} as IProvider);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [message, setMessage] = React.useState<SnackMessageProps>({
    msg: "",
    color: "success",
  });
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    setUser(data);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/signin", { replace: true });
  };

  const closeSnackBar = () =>{
    setSnackOpen(false)
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      loading,
      setLoading,
      snackOpen, 
      setSnackOpen, 
      message, 
      setMessage,
    }),
    [ user,
      setUser,
      login,
      logout,
      loading,
      setLoading,
      snackOpen, 
      setSnackOpen, 
      message, 
      setMessage,]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};