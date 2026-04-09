import PropTypes from 'prop-types';
import { Coffee } from 'lucide-react';

export function MessageCard({ message }) {
  return (
    <div className="max-w-md w-full bg-amber-100 text-orange-950 border-2 border-amber-700 rounded-xl shadow-lg p-8 text-center flex flex-col items-center gap-4 mx-auto">
      <Coffee size={48} className="text-amber-700" />
      <p className="text-2xl font-medium">{message}</p>
    </div>
  );
}

MessageCard.propTypes = {
  message: PropTypes.string.isRequired,
};
