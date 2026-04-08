import { Coffee } from 'lucide-react';
import PropTypes from 'prop-types';

export function CoffeeBackground({ children }) {
  return (
    <div className="min-h-screen w-full bg-stone-100 bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative subtle background icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
        <Coffee size={600} strokeWidth={1} className="text-stone-900" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}

CoffeeBackground.propTypes = {
  children: PropTypes.node,
};

export default CoffeeBackground;