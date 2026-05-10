import { AuthContextProvider } from '@/contexts/AuthContext';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import PushMessageListener from '@/components/common/PushMessageListener';
import NotificationPrompt from '@/components/common/NotificationPrompt';

/** @param {{children: import('react').ReactNode}} props */
const Providers = ({ children }) => (
  <ThemeContextProvider>
    <ThemeProvider>
      <AuthContextProvider>
        <ToastProvider>
          <PushMessageListener />
          <NotificationPrompt />
          {children}
        </ToastProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </ThemeContextProvider>
);

export default Providers;
