import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cryptocurrencies', path: '/market' },
    { name: 'Prediction', path: '/prediction' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fff7fa]/80 backdrop-blur-xl border-b border-[#556069]/10 shadow-sm shadow-[#556069]/5">
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[#556069]">Agamin</Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-headline tracking-tight headline-sm transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-[#556069] font-bold border-b-2 border-[#556069] pb-1'
                    : 'text-[#556069]/60 hover:text-[#556069]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#faf1f4] rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
            <Bell size={20} className="text-[#556069]" />
          </button>
          <button className="p-2 hover:bg-[#faf1f4] rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
            <User size={20} className="text-[#556069]" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
