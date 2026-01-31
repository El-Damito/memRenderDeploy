import { useState } from 'react';

import './App.css';

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function App() {
  const [result, setResult] = useState('');
  
  return (
    <>
      <div className='App'>
        <h1>
          Usuarios
        </h1>
        <button onClick={async() =>{
          const res = await fetch(`${URL}/ping`);

          const data = await res.json();
          console.log(data);
          setResult(data);
        }}>
          Users
        </button>
        <pre>{JSON.stringify(result,null,2)}</pre>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App
