import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/forms/LoginForm";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
};

export default ProtectedRoute;
