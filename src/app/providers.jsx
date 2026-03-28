import { AuthContextProvider } from '@/contexts/AuthContext';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';

/** @param {{children: import('react').ReactNode}} props */
const Providers = ({ children }) => (
  <ThemeContextProvider>
    <ThemeProvider>
      <AuthContextProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </ThemeContextProvider>
);

export default Providers;
