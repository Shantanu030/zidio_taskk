import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Spinner from '../ui/Spinner';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // TEMPORARY: Bypass authentication check
  // const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  // if (isLoading) {
  //   return <Spinner />;
  // }
  
  // return user ? <>{element}</> : <Navigate to="/login" replace />;
  
  // TEMPORARY: Always render the protected route without authentication
  return <>{element}</>;
};

export default PrivateRoute; 