import { createContext } from 'react';

/**
 * Auth Context definition — separated from the Provider component
 * so AuthContext.jsx only exports components (required by react-refresh).
 */
const AuthContext = createContext(null);

export default AuthContext;
