import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './routes/HomePage.tsx';
import EditDataPage from './routes/EditDataPage.tsx';
import SignupPage from './routes/SignupPage.tsx';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/edit-data" element={<EditDataPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
