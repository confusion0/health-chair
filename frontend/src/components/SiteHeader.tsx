import { Link } from 'react-router-dom';

import '../styles/SiteHeader.css';
import caduceus from '../assets/Caduceus.svg';

export default function SiteHeader() {
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
        <li><Link to="/signup">Get Started</Link></li>
      </ul>
    </header>
  );
};
