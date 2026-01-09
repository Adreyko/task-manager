import { useTheme } from '@/app/providers/ThemeProvider/hooks/useTheme';
import { Link } from 'react-router-dom';
import { getRouteProfile } from '@/app/providers/Router/conts/routers';
import { useInitUser } from '@/entities/User/api/userApi';

const Navbar = () => {
  const { toggleTheme } = useTheme();
  const { data: user } = useInitUser();

  return (
    <div
      className={
        'h-navbar-height bg-inverted-bg-color text-inverted-primary-color flex items-center justify-between px-4'
      }
    >
      <button onClick={() => toggleTheme()}>toggle</button>
      {user && (
        <Link to={getRouteProfile()} className="text-inverted-primary-color">
          Profile
        </Link>
      )}
    </div>
  );
};

export default Navbar;
