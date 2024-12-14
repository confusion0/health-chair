import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthTokenContext from '../AuthTokenContext';

import '../styles/SiteHeader.css';
import caduceus from '../assets/Caduceus.svg';

export default function SiteHeader() {
  const { token, setToken } = useContext(AuthTokenContext);
  const hasToken = token !== null;

  function logOut() {
    setToken(null);
  }

  return (
    <header>
      <h1>
        <Link to="/">
          <img src={caduceus} alt="Logo" />
          HealthChair
        </Link>
      </h1>
      <ul>
        <li><Link to="/about">About</Link></li>
        {
          hasToken
          ? <>
              <li><Link to="/edit-data">Edit Data</Link></li>
              <li><Link to="/daily-planner">Daily Planner</Link></li>
              <li><Link onClick={logOut} to="/">Sign Out</Link></li>
            </>
          : <>
              <li><Link to="/log-in">Log In</Link></li>
              <li className="flourish"><Link to="/sign-up">Get Started</Link></li>
            </>
        }
      </ul>
    </header>
  );
};
