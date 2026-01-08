import api from "../api";

export default function MovieTable({ movies, reload }) {
  const deleteMovie = async (id) => {
    await api.delete(`/movies/${id}`);
    reload();
  };

  return (
    <table border="1" cellPadding="5">
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
        {movies.map((m) => (
          <tr key={m.id}>
            <td>{m.title}</td>
            <td>{m.release_date}</td>
            <td>{m.genre}</td>
            <td>{m.popularity}</td>
            <td>
              <button onClick={() => deleteMovie(m.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
