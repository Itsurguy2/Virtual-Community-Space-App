import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import LocationDetail from './components/LocationDetail';
import AllEvents from './components/AllEvents';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:location" element={<LocationDetail />} />
        <Route path="/events" element={<AllEvents />} />
      </Routes>
    </Router>
  );
}

export default App;