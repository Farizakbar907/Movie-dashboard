import { useEffect, useState } from "react";
import api from "../api";
import Charts from "../components/Charts";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    api.get("/movies").then(res => setMovies(res.data));
  }, []);

  const filtered = movies.filter(m => {
    const d = new Date(m.release_date);
    return (!start || d >= new Date(start)) &&
           (!end || d <= new Date(end));
  });

  const genreCount = {};
  filtered.forEach(m => {
    genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
  });

  const lastMonth = filtered.filter(m =>
    new Date(m.release_date) >= new Date(Date.now() - 30*24*60*60*1000)
  );

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Total Movies: {filtered.length}</p>

      <label>Start Date</label>
      <input type="date" onChange={e => setStart(e.target.value)} />

      <label>End Date</label>
      <input type="date" onChange={e => setEnd(e.target.value)} />

      <h3>Distribusi Genre</h3>
      <Pie data={{
        labels: Object.keys(genreCount),
        datasets: [{ data: Object.values(genreCount) }]
      }} />

      <h3>Film 1 Bulan Terakhir</h3>
      <Bar data={{
        labels: lastMonth.map(m => m.title),
        datasets: [{
          label: "Movies",
          data: lastMonth.map(() => 1)
        }]
      }} />
    </div>
  );
}