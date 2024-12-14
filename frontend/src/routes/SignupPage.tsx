import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.tsx';

import '../styles/SignupPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errorMsg, setErrorMsg ] = useState("");
  
  function runSignup() {
    fetch('http://localhost:1234/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json().then(body => ({ ok: response.ok, body })))
      .then(data => {
        console.log(data)
        if(data.ok) {
          navigate('/edit-data');
        } else {
          setErrorMsg(data.body.res);
        }
      })
      .catch(error => setErrorMsg(error));
  }
  
  return (
    <>
      <SiteHeader />
      <section>
        <h2>Sign Up</h2>
        { errorMsg && <p>{errorMsg}</p> }
        <div className="signup-form">
          <table>
            <tbody>
              <tr>
                <td>Email:</td>
                <td><input type="email" value={email} onChange={ e => setEmail(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Password:</td>
                <td><input type="password" value={password} onChange={ e => setPassword(e.target.value) } /></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  <button onClick={runSignup}>Sign Up</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
