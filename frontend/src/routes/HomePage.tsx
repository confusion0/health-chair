import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.tsx';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <section>
        <h2>Own your health</h2>
        <p>
          With HealthChair, you can manage your health with ease from the comfort of your own home.
        </p>
        <p>
          Leverage the power of AI to create effective routines for managing your well-being.
        </p>
        <Link to="/sign-up" className="buttonlike-link">Get started today</Link>
      </section>
    </>
  );
};
