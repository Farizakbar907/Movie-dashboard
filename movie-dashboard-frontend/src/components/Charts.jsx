import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Charts({ movies }) {
  const genreCount = {};
  movies.forEach((m) => {
    genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(genreCount),
    datasets: [
      {
        data: Object.values(genreCount)
      }
    ]
  };

  const dateCount = {};
  movies.forEach((m) => {
    if (m.release_date) {
      dateCount[m.release_date] = (dateCount[m.release_date] || 0) + 1;
    }
  });

  const barData = {
    labels: Object.keys(dateCount),
    datasets: [
      {
        label: "Movies per Date",
        data: Object.values(dateCount)
      }
    ]
  };

  return (
    <>
      <h3>Distribusi Genre</h3>
      <Pie data={pieData} />

      <h3>Agregasi per Tanggal</h3>
      <Bar data={barData} />
    </>
  );
}