import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.tsx';

import '../styles/SignupPage.css';

export default function SignupPage() {
  const [ name, setName ] = useState("");
  const [ sex, setSex ] = useState("");
  const [ birthYear, setBirthYear ] = useState(0);
  const [ weight, setWeight ] = useState(0);
  const [ height, setHeight ] = useState(0);
  const [ heartRate, setHeartRate ] = useState(0);
  const [ bloodSugar, setBloodSugar ] = useState(0);

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
        <h2>Edit Data</h2>
        <div className="signup-form">
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td><input type="text" value={name} onChange={ e => setName(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Sex:</td>
                <td>
                  <select value={sex} onChange={ e => setSex(e.target.value) }>
                    <option value="">---</option>
                    <option value="f">Female</option>
                    <option value="m">Male</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Birth year:</td>
                <td><input type="number" value={birthYear} onChange={ e => setBirthYear(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Weight (kg):</td>
                <td><input type="number" value={weight} onChange={ e => setWeight(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Height (cm):</td>
                <td><input type="number" value={height} onChange={ e => setHeight(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Heart rate (bpm):</td>
                <td><input type="number" value={heartRate} onChange={ e => setHeartRate(e.target.value) } /></td>
              </tr>
              <tr>
                <td>Blood sugar (mmHg):</td>
                <td><input type="number" value={bloodSugar} onChange={ e => setBloodSugar(e.target.value) } /></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  <button onClick={runEditData}>Sign Up</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
