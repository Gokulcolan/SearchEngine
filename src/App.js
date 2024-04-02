import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
import Progressbar from './progressbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progressbar />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
