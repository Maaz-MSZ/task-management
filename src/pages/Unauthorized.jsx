import React from 'react';

const Unauthorized = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-500">403 - Unauthorized</h1>
      <p className="text-lg mt-2">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;