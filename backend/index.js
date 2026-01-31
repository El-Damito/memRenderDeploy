import express from "express";
import cors from "cors";
import pg from "pg";
import { createServer } from "http";
import { Server } from "socket.io";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, FRONTED_URL, PORT } from './config.js';

// --- CLASE PERSONA ---
class Persona {
    constructor(cedula, nombre, condicion, direccion) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.condicion = condicion;
        this.direccion = direccion;
    }
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: FRONTED_URL } });

const pool = new pg.Pool({
    host: DB_HOST, database: DB_DATABASE, user: DB_USER, password: DB_PASSWORD, port: DB_PORT,
    ssl: { rejectUnauthorized: false } // Requerido para Render
});

app.use(cors({ origin: FRONTED_URL }));
app.use(express.json());

// --- RUTAS ---

// Login Simple (Simulado para el ejemplo)
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        res.json({ success: true, token: "fake-jwt-token" });
    } else {
        res.status(401).json({ error: "Credenciales inválidas" });
    }
});

// Obtener todas las personas
app.get("/personas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM personas");
        // Mapeamos los resultados a instancias de la Clase Persona
        const listaPersonas = result.rows.map(p => new Persona(p.cedula, p.nombre, p.condicion, p.direccion));
        res.json(listaPersonas);
    } catch (err) {
        res.status(500).send("Error en el servidor");
    }
});

// Ruta para recibir alerta desde Android
app.post("/enviar-alerta", (req, res) => {
    const { nombre } = req.body;
    io.emit("nueva-alerta", { mensaje: `¡Alerta! ${nombre} ha presionado el botón.` });
    res.json({ status: "Alerta procesada" });
});

httpServer.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));