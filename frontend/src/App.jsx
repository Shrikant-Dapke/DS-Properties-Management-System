/**
 * DS Properties — Root Application Component
 *
 * Currently shows a component showcase for verification.
 * Will be expanded with:
 * - React Router (Task 13)
 * - AuthProvider (Task 13)
 */

import { ToastProvider } from './contexts/ToastContext';
import ComponentShowcase from './ComponentShowcase';

function App() {
  return (
    <ToastProvider>
      <ComponentShowcase />
    </ToastProvider>
  );
}

export default App;
