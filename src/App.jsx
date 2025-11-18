import { Routes, Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {

  return (
    <div className="flex" style={{backgroundColor: '#D4F1F9', minHeight: '100vh'}}>
      <Sidebar />

      <main className="flex-1 p-6 ml-60">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
    
  );
}

export default App
