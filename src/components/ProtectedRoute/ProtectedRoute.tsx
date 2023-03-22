import React, { useCallback } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuth } from "../../contexts/slices/authSlice";
import { ProtectedRouteProps } from "../../types/components/ProtectedRoute";

import IdleTimerContainer from "../IdleTimerContainer";

const ProtectedRoute = ({
  children,
  redirectPath = `${process.env.REACT_APP_PUBLIC_URL}/`,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { authResult } = useSelector(selectAuth);

  useCallback(() => {
    window.onpopstate = (e) => {
      if (location.pathname === `${process.env.REACT_APP_PUBLIC_URL}/`) {
        if (authResult?.status) {
          navigate(`${process.env.REACT_APP_PUBLIC_URL}/Main`);
        }
      }
    };
  }, [authResult]);

  return (
    <IdleTimerContainer>
      {authResult?.status ? children : <Navigate to={redirectPath} replace />}
    </IdleTimerContainer>
  );
};

export default ProtectedRoute;
