import CurrencyConverter from './CurrencyConverter';
import CustomFooter from './CustomFooter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Exchange Rates</h1>
      </header>
      <CurrencyConverter />
      <CustomFooter />
    </div>
  );
}

export default App;
