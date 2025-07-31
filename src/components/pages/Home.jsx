import React from 'react';
import { Navigate } from 'react-router-dom';
import HomeComponents from '../home/HomeComponents';

const Home = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <HomeComponents />;
};

export default Home;
