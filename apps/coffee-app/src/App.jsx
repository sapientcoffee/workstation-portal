import { CoffeeBackground } from './components/CoffeeBackground';
import { MessageCard } from './components/MessageCard';

function App() {
  return (
    <CoffeeBackground>
      <div className="z-10 w-full flex justify-center px-4">
        <MessageCard message="Good morning! Time for some coffee." />
      </div>
    </CoffeeBackground>
  );
}

export default App;
