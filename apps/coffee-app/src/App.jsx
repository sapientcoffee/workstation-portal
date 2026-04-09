import { useState } from 'react';
import { CoffeeBackground } from './components/CoffeeBackground';
import { MessageCard } from './components/MessageCard';
import { RefreshButton } from './components/RefreshButton';
import { getRandomMessage } from './data/messages';

function App() {
  const [message, setMessage] = useState(() => getRandomMessage());

  const handleRefresh = () => {
    setMessage(getRandomMessage(message));
  };

  return (
    <CoffeeBackground>
      <div className="z-10 w-full flex flex-col items-center gap-8 px-4">
        <MessageCard message={message} />
        <RefreshButton onRefresh={handleRefresh} />
      </div>
    </CoffeeBackground>
  );
}

export default App;
