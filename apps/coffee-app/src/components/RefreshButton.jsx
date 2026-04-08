import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';

export function RefreshButton({ onRefresh }) {
  return (
    <button
      onClick={onRefresh}
      className="mt-8 px-6 py-3 bg-amber-700 text-amber-50 rounded-full font-semibold shadow-md hover:bg-amber-800 transition-colors flex items-center gap-2"
    >
      <RefreshCw size={20} />
      Next Cup
    </button>
  );
}

RefreshButton.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default RefreshButton;