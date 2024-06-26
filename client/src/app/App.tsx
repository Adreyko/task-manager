import Navbar from '@/widgets/Navbar/components/Navbar';
import AppRouter from './providers/Router/components/AppRouter';
import { useTheme } from './providers/ThemeProvider/hooks/useTheme';
import './styles/index.scss';
function App() {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <div className='h-[calc(100vh-var(--navbar-height))]'>
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
