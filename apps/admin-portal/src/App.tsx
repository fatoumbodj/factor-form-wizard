import { Suspense, useEffect, useState } from 'react';

import { Route, Routes, Link } from 'react-router-dom';
import './App.css'
import Index from './index/Index';
import {LoginPage} from './pages/login/Login.page';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 1000)
  }, [])

  return isAuthenticated ? (
    <div className='App'>
      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="*" element={<Index />} />
        </Routes>
      </Suspense>
    </div>

  ) : (
    <div className="vh-100">
      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
