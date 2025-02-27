import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "./authProvider";

export const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/signin" />;
  }
  return children;
};