import React from "react";
import { Routes, Route } from "react-router-dom";
import SignInSide from "./components/pages/signIn";
import SignUp from "./components/pages/signUp";
import { ProtectedRoute } from "./components/auth/protectedRoute";
import DashBoard from "./components/pages/dashboard";
import Profile from "./components/pages/profile";
import SimpleBackdrop from "./components/common/loader";
import { useAuth } from "./components/auth/authProvider";
import CustomSnackbar from "./components/common/snackBar";
import ErrorPage from "./components/pages/notFound";

const RouterApp = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
        <DashBoard />
        </ProtectedRoute>
      } />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
          <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<SignInSide />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<ErrorPage/>} />
    </Routes>
  )
}
export default function App() {
  const { loading, snackOpen, setSnackOpen, message } = useAuth()

  return (
    <>
    {loading && <SimpleBackdrop/>}
      <RouterApp />
      <CustomSnackbar
        open={snackOpen}
        setOpen={setSnackOpen}
        message={message.msg}
        severity={message.color}
      />
    </>
  );
}