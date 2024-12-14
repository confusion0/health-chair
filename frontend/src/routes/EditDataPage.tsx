import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.tsx';

import AuthTokenContext from '../AuthTokenContext.tsx';

import '../styles/LoginAndSignupPages.css';

interface IPatientData {
  name: string;
  sex: string;
  birthYear: number;
  weight: number;
  height: number;
  heartRate: number;
  bloodSugar: number;
  conditions: string;
  symptoms: string;
}

function SignupPageWithData({ data }: { data: IPatientData }) {
  const navigate = useNavigate();

  const [ name, setName ] = useState(data.name ?? "");
  const [ sex, setSex ] = useState(data.sex ?? "");
  const [ birthYear, setBirthYear ] = useState(data.birthYear ?? 0);
  const [ weight, setWeight ] = useState(data.weight ?? 0);
  const [ height, setHeight ] = useState(data.height ?? 0);
  const [ heartRate, setHeartRate ] = useState(data.heartRate ?? 0);
  const [ bloodSugar, setBloodSugar ] = useState(data.bloodSugar ?? 0);
  const [ conditions, setConditions ] = useState(data.conditions ?? "");
  const [ symptoms, setSymptoms ] = useState(data.symptoms ?? "");

  const [ errorMsg, setErrorMsg ] = useState("");

  const { token } = useContext(AuthTokenContext);

  function runEditData() {
    fetch('http://localhost:1234/edit-data', {
      method: 'POST',
      body: JSON.stringify({
        name,
        sex, 
        birth_year: birthYear,
        weight,
        height,
        heart_rate: heartRate,
        blood_sugar: bloodSugar,
        conditions,
        symptoms
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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
      <section>
        <h2>Edit Data</h2>
        { errorMsg && <p>{JSON.stringify(errorMsg)}</p> }
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
                <td><input type="number" value={birthYear} onChange={ e => setBirthYear(+e.target.value) } /></td>
              </tr>
              <tr>
                <td>Weight (kg):</td>
                <td><input type="number" value={weight} onChange={ e => setWeight(+e.target.value) } /></td>
              </tr>
              <tr>
                <td>Height (cm):</td>
                <td><input type="number" value={height} onChange={ e => setHeight(+e.target.value) } /></td>
              </tr>
              <tr>
                <td>Heart rate (bpm):</td>
                <td><input type="number" value={heartRate} onChange={ e => setHeartRate(+e.target.value) } /></td>
              </tr>
              <tr>
                <td>Blood sugar (mmol/L):</td>
                <td><input type="number" value={bloodSugar} onChange={ e => setBloodSugar(+e.target.value) } /></td>
              </tr>
              <tr>
                <td>Medical conditions<br /><small>(comma-separated)</small></td>
                <td><textarea value={conditions} onChange={ e => setConditions(e.target.value) }></textarea></td>
              </tr>
              <tr>
                <td>Symptoms<br /><small>(comma-separated)</small></td>
                <td><textarea value={symptoms} onChange={ e => setSymptoms(e.target.value) }></textarea></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  <button onClick={runEditData}>Save Changes</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

function SignupPageSection({ token }: { token: string }) {
  const [ data, setData ] = useState<IPatientData | null>(null);
  const [ errorMsg, setErrorMsg ] = useState<string>("");

  useEffect(() => {
    if(data || errorMsg) return;
    
    fetch('http://localhost:1234/get-data', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json().then(body => ({ ok: response.ok, body })))
      .then(theData => {
        console.log(theData,"are the")
        if(theData.ok) {
          setData(theData.body);
        } else {
          setErrorMsg(theData.body.res);
        }
      })
      .catch(error => setErrorMsg(error.toString()));
  }, [token]);
  
  if(errorMsg) {
    return (
      <>
        <h2>Error</h2>
        <p>{errorMsg}</p>
      </>
    );
  } else if(!data) {
    return <section><h2>Loading...</h2></section>;
  }

  return <SignupPageWithData data={data} />;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);
  
  if(!token) {
    navigate('/sign-up');
    return <p>Not logged in, please wait...</p>;
  }

  return (
    <>
      <SiteHeader />
      <SignupPageSection token={token} />
    </>
  );
};
