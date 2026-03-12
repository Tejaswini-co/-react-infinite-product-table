import ProductTable from './components/ProductTable';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Modern Product Table</h1>
        <p>A responsive React table with infinite scroll and editable titles</p>
      </header>
      <main>
        <ProductTable />
      </main>
    </div>
  );
}

export default App;