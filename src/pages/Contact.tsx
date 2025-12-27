import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to Support page since Contact is included there
const Contact: React.FC = () => {
  return <Navigate to="/support" replace />;
};

export default Contact;
