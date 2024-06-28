import { Navbar } from '@/widgets';
import AppRouter from './providers/Router/components/AppRouter';
import { useTheme } from './providers/ThemeProvider/hooks/useTheme';
import './styles/index.scss';
import { useInitUser } from '@/entities/User/api/userApi';
function App() {
  const { theme } = useTheme();
  const { isLoading } = useInitUser();

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <div className='min-h-[calc(100vh-var(--navbar-height))]'>
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
