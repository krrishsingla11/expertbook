import React, { createContext, useContext } from 'react';

// Socket.io is not supported in serverless deployments (Vercel).
// This context is a no-op so existing useSocket() calls don't break.
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={null}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
