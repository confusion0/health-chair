import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import HomePage from './routes/HomePage.tsx';
import EditDataPage from './routes/EditDataPage.tsx';
import LoginPage from './routes/LogInPage.tsx';
import SignupPage from './routes/SignupPage.tsx';
import DailyPlanner from './routes/DailyPlanner.tsx';
import AboutPage from './routes/AboutPage.tsx';

import AuthTokenContext from './AuthTokenContext.tsx';

function App() {
  const [ token, setToken ] = useState<string | null>(useContext(AuthTokenContext).token);

  const queryClient = new QueryClient();

  function setTokenWrapper(token: string | null) {
    if(token === null) {
      localStorage.removeItem('authtoken');
    } else {
      localStorage.setItem('authtoken', token);
    }
    setToken(token);
  }

  return (
    <>
      <AuthTokenContext.Provider value={{ token, setToken: setTokenWrapper }}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/edit-data" element={<EditDataPage />} />
              <Route path="/log-in" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/daily-planner" element={<DailyPlanner />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AuthTokenContext.Provider>
    </>
  );
}

export default App;
