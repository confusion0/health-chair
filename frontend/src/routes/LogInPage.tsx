import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.tsx';

import '../styles/LoginAndSignupPages.css';
import AuthTokenContext from '../AuthTokenContext.tsx';

export default function LogInPage() {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  
  const [ errorMsg, setErrorMsg ] = useState("");
  const { token, setToken } = useContext(AuthTokenContext);
  
  function runLogin() {
    fetch('http://localhost:1234/login', {
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
          setToken(data.body.access_token);
          navigate('/');
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
        <h2>Log In</h2>
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
                  <button onClick={runLogin}>Log In</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};