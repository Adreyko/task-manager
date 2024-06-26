import { useTheme } from '@/app/providers/ThemeProvider/hooks/useTheme';

const Navbar = () => {
  const { toggleTheme } = useTheme();
  return (
    <div
      className={
        'h-navbar-height bg-inverted-bg-color text-inverted-primary-color'
      }
    >
      <button onClick={() => toggleTheme()}>toggle</button>
    </div>
  );
};

export default Navbar;
