import { CoffeeBackground } from './components/CoffeeBackground';
import { MessageCard } from './components/MessageCard';
import { RefreshButton } from './components/RefreshButton';

function App() {
  const handleRefresh = () => {
    console.log('Refresh button clicked');
  };

  return (
    <CoffeeBackground>
      <div className="z-10 w-full flex flex-col items-center px-4">
        <MessageCard message="Good morning! Time for some coffee." />
        <RefreshButton onRefresh={handleRefresh} />
      </div>
    </CoffeeBackground>
  );
}

export default App;