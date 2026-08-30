import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated) {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      return <Navigate to={decodeURIComponent(redirect)} replace />;
    }
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'faculty') {
      return <Navigate to="/faculty" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
