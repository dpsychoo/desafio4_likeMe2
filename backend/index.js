const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  allowExitOnIdle: true,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// GET
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Nuevo Post
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el post:", error);
    res.status(500).send("Error en el servidor");
  }
});

// PUT: Likes
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al incrementar likes:", error);
    res.status(500).send("Error en el servidor");
  }
});

/* Si quiero actualizar likes xd
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { likes } = req.body;

    try {
        let query;
        let values;

        if (likes !== undefined) {
            query = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *';
            values = [likes, id];
        } else {
            query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
            values = [id];
        }

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).send('Post no encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar los likes:', error);
        res.status(500).send('Error en el servidor');
    }
}); */

//Deletear
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }
    res.send("Post eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar post:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
