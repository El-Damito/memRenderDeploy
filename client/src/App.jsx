import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const socket = io(URL);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    socket.on("nueva-alerta", (data) => {
      setAlerta(data.mensaje);
      setTimeout(() => setAlerta(null), 5000);
    });
    return () => socket.off("nueva-alerta");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = e.target.username.value;
    const pass = e.target.password.value;
    
    const res = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    
    if (res.ok) {
      setIsLoggedIn(true);
      fetchPersonas();
    } else {
      alert("Error de acceso");
    }
  };

  const fetchPersonas = async () => {
    const res = await fetch(`${URL}/personas`);
    const data = await res.json();
    setPersonas(data);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <input name="username" placeholder="Usuario" required />
          <input name="password" type="password" placeholder="Contraseña" required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className='App'>
      {alerta && <div className="banner-alerta">{alerta}</div>}
      <h1>Personas Registradas</h1>
      <table>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Condición</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {personas.map(p => (
            <tr key={p.cedula}>
              <td>{p.cedula}</td>
              <td>{p.nombre}</td>
              <td>{p.condicion}</td>
              <td>{p.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;