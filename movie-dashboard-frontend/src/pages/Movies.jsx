import { useEffect, useState } from "react";
import api from "../api";
import MovieTable from "../components/MovieTable";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    release_date: "",
    genre: "",
    popularity: ""
  });
  const [editing, setEditing] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const fetchMovies = async () => {
    const res = await api.get("/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
	fetchLastSync();
  }, []);

/* ================= FETCH LAST SYNC ================= */
  const fetchLastSync = async () => {
    const res = await api.get("/last-sync");
    setLastSync(res.data.last_sync);
  };
  
  // CREATE
  const createMovie = async () => {
    await api.post("/movies", form);
    setForm({ title: "", release_date: "", genre: "", popularity: "" });
    fetchMovies();
  };

  // UPDATE
  const updateMovie = async () => {
    await api.put(`/movies/${editing.id}`, editing);
    setEditing(null);
    fetchMovies();
  };

  // DELETE
  const deleteMovie = async (id) => {
    await api.delete(`/movies/${id}`);
    fetchMovies();
  };

  // SYNC
  const handleSync = async () => {
    try {
      await api.post("/sync-movies");
      alert("Sync berhasil");
      fetchMovies();
	  fetchLastSync();
    } catch (err) {
      console.error(err);
      alert("Sync gagal");
    }
  };

  return (
    <div>
      <h2>Manajemen Data Film</h2>
      <button onClick={handleSync}>
        Sync Data
      </button>
	  {lastSync && (
        <p>
          Last Sync:{" "}
          <b>{new Date(lastSync).toLocaleString()}</b>
        </p>
      )}

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

    <input type="date" value={editing.release_date}
      onChange={e => setEditing({ ...editing, release_date: e.target.value })} />

    <input value={editing.genre}
      onChange={e => setEditing({ ...editing, genre: e.target.value })} />

    <input value={editing.popularity}
      onChange={e => setEditing({ ...editing, popularity: e.target.value })} />

    <button onClick={updateMovie}>Save</button>
    <button onClick={() => setEditing(null)}>Cancel</button>
  </>
)}

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Date</th>
            <th>Genre</th>
            <th>Popularity</th>
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
    </div>
  );
}