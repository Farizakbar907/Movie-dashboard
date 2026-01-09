import { useEffect, useState } from "react";
import api from "../api";
import MovieTable from "../components/MovieTable";

export default function Movies() {
const [search, setSearch] = useState("");
const [sort, setSort] = useState("updated_at");
const [order, setOrder] = useState("DESC");
const [filterTitle, setFilterTitle] = useState("");
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  const [filterGenre, setFilterGenre] = useState(""); 
  const [movies, setMovies] = useState([]);
  const [syncing, setSyncing] = useState(false);
const [syncProgress, setSyncProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    release_date: "",
    genre: "",
    popularity: ""
  });
  const [editing, setEditing] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const fetchMovies = async () => {
  setLoading(true);
  try {
    const res = await api.get("/movies", {
      params: {
        search,
        genre: filterGenre,
        sort,
        order
      }
    });

    setMovies(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    setMovies([]);
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  fetchMovies();
  fetchLastSync();
}, [search, sort, order, filterGenre]);

/* ================= FETCH LAST SYNC ================= */
  const fetchLastSync = async () => {
    const res = await api.get("/last-sync");
    setLastSync(res.data.last_sync);
  };
  
  // CREATE
  const createMovie = async () => {
  setError("");
  setMessage("");

  try {
    await api.post("/movies", form);
    setForm({ title: "", release_date: "", genre: "", popularity: "" });
    setMessage("Data berhasil ditambahkan");
    fetchMovies();
  } catch (err) {
    setError(err.response?.data?.message || "Gagal menambah data");
  }
};

  // UPDATE
  const updateMovie = async () => {
    await api.put(`/movies/${editing.id}`, editing);
    setEditing(null);
    fetchMovies();
  };

  // DELETE
  const deleteMovie = async (id) => {
  if (!window.confirm("Yakin ingin menghapus data ini?")) return;

  await api.delete(`/movies/${id}`);
  fetchMovies();
};

  // SYNC
 const handleSync = async () => {
  setSyncing(true);
  setSyncProgress(10);

  const interval = setInterval(() => {
    setSyncProgress(prev => (prev < 90 ? prev + 10 : prev));
  }, 500);

  try {
    await api.post("/sync-movies");
    setSyncProgress(100);
    fetchMovies();
    fetchLastSync();
    alert("Sync berhasil");
  } catch (err) {
    alert("Sync gagal");
  } finally {
    clearInterval(interval);
    setTimeout(() => {
      setSyncing(false);
      setSyncProgress(0);
    }, 500);
  }
};

  return (
    <div>
	{loading && <p>Loading...</p>}

      <h2>Manajemen Data Film</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <button onClick={handleSync} disabled={syncing}>
  {syncing ? "Syncing..." : "Sync Data"}
</button>
{syncing && (
  <div style={{ marginTop: "5px", width: "200px" }}>
    <div
      style={{
        height: "10px",
        width: `${syncProgress}%`,
        backgroundColor: "#4caf50",
        transition: "width 0.4s"
      }}
    />
  </div>
)}

  {lastSync && (
    <small>Last Sync: {new Date(lastSync).toLocaleString()}</small>
  )}
</div>


      <h3>Create Movie</h3>
      <input placeholder="Title" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <input type="date" value={form.release_date}
        onChange={e => setForm({ ...form, release_date: e.target.value })} />

      <input placeholder="Genre" value={form.genre}
        onChange={e => setForm({ ...form, genre: e.target.value })} />

      <input placeholder="Popularity" value={form.popularity}
        onChange={e => setForm({ ...form, popularity: e.target.value })} />

      <button onClick={createMovie}>Create</button>

      {editing && (
  <>
    <h3>Edit Movie</h3>

    <input value={editing.title}
      onChange={e => setEditing({ ...editing, title: e.target.value })} />

    <input
	type="date"
	value={editing.release_date?.split("T")[0] || ""}
	onChange={e =>
		setEditing({ ...editing, release_date: e.target.value })
	}
	/>

    <input value={editing.genre}
      onChange={e => setEditing({ ...editing, genre: e.target.value })} />

    <input value={editing.popularity}
      onChange={e => setEditing({ ...editing, popularity: e.target.value })} />

    <button onClick={updateMovie}>Save</button>
    <button onClick={() => setEditing(null)}>Cancel</button>
  </>
)}

	<div style={{ margin: "10px 0" }}>
  <input
    placeholder="Search title..."
    value={search}
    onChange={e => setSearch(e.target.value)}
  />

  <select
    value={filterGenre}
    onChange={e => setFilterGenre(e.target.value)}
    style={{ marginLeft: "10px" }}
  >
    <option value="">All Genre</option>
    <option value="Action">Action</option>
    <option value="Drama">Drama</option>
    <option value="Comedy">Comedy</option>
  </select>
</div>

	{message && <p style={{ color: "green" }}>{message}</p>}
	{error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th onClick={() => {
			  setSort("title");
			  setOrder(order === "ASC" ? "DESC" : "ASC");
			}}>
			  Title {sort === "title" ? (order === "ASC" ? "▲" : "▼") : ""}
			</th>
            <th onClick={() => {
			  setSort("release_date");
			  setOrder(order === "ASC" ? "DESC" : "ASC");
			}}>
			  Release Date {sort === "release_date" ? (order === "ASC" ? "▲" : "▼") : ""}
			</th>
            <th onClick={() => {
			  setSort("genre");
			  setOrder(order === "ASC" ? "DESC" : "ASC");
			}}>
			  Genre {sort === "genre" ? (order === "ASC" ? "▲" : "▼") : ""}
			</th>
            <th onClick={() => {
			  setSort("popularity");
			  setOrder(order === "ASC" ? "DESC" : "ASC");
			}}>
			  Popularity {sort === "popularity" ? (order === "ASC" ? "▲" : "▼") : ""}
			</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(m => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.release_date}</td>
              <td>{m.genre}</td>
              <td>{m.popularity}</td>
              <td>
                <button onClick={() => setEditing(m)}>Edit</button>
                <button onClick={() => deleteMovie(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
	  {!loading && movies.length === 0 && (
  <p>Tidak ada data</p>
)}

    </div>
  );
}