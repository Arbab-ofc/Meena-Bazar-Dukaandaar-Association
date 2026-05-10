import { AuthContextProvider } from '@/contexts/AuthContext';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import PushMessageListener from '@/components/common/PushMessageListener';

/** @param {{children: import('react').ReactNode}} props */
const Providers = ({ children }) => (
  <ThemeContextProvider>
    <ThemeProvider>
      <AuthContextProvider>
        <ToastProvider>
          <PushMessageListener />
          {children}
        </ToastProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </ThemeContextProvider>
);

export default Providers;
