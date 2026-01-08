import express from "express";
import axios from "axios";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// TEST SERVER
app.get("/", (req, res) => {
  res.send("Backend running");
});

// SYNC MOVIES FROM TMDB
app.post("/sync-movies", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        params: { api_key: process.env.TMDB_API_KEY }
      }
    );

    const movies = response.data.results;

    for (const movie of movies) {
      await db.query(
        `INSERT INTO movies (tmdb_id, title, release_date, genre, popularity)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         release_date = VALUES(release_date),
         popularity = VALUES(popularity),
         updated_at = CURRENT_TIMESTAMP`,
        [
          movie.id,
          movie.title,
          movie.release_date,
          movie.genre_ids?.[0] || "Unknown",
          movie.popularity
        ]
      );
    }
	await db.query(
      "INSERT INTO sync_logs (last_sync) VALUES (NOW())"
    );
	
    res.json({
      message: "Sync success",
      total: movies.length
      // last_sync: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API GET MOVIES
app.get("/movies", async (req, res) => {
  try {
    const {
      search,
      genre,
      sort = "updated_at",
      order = "DESC"
    } = req.query;

    let sql = "SELECT * FROM movies WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND title LIKE ?";
      params.push(`%${search}%`);
    }

    if (genre) {
      sql += " AND genre = ?";
      params.push(genre);
    }

    sql += ` ORDER BY ${sort} ${order}`;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// API LAST Sync
app.get("/last-sync", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT last_sync FROM sync_logs ORDER BY last_sync DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.json({ last_sync: null });
    }

    res.json({ last_sync: rows[0].last_sync });
  } catch (err) {
    res.status(500).json(err);
  }
});

// API CREATE 
app.post("/movies", async (req, res) => {
  try {
    const { title, release_date, genre, popularity } = req.body;

    await db.query(
      "INSERT INTO movies (title, release_date, genre, popularity) VALUES (?, ?, ?, ?)",
      [title, release_date, genre, popularity]
    );

    res.json({ message: "Movie created" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// API UPDATE data
app.put("/movies/:id", async (req, res) => {
  try {
    const { title, release_date, genre, popularity } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE movies SET title=?, release_date=?, genre=?, popularity=? WHERE id=?",
      [title, release_date, genre, popularity, id]
    );

    res.json({ message: "Movie updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// API DELETE data
app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM movies WHERE id=?", [id]);

    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});