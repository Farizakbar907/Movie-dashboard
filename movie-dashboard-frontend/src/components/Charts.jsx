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

export default function Charts({ movies = [] }) {
  // ===== PIE CHART (GENRE) =====
  const genreCount = {};

  movies.forEach(m => {
    if (m.genre) {
      genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
    }
  });

  const pieData = {
    labels: Object.keys(genreCount),
    datasets: [
      {
        label: "Genre Distribution",
        data: Object.values(genreCount),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#E91E63",
          "#9C27B0"
        ]
      }
    ]
  };

  // ===== BAR CHART (PER DATE) =====
  const dateCount = {};

  movies.forEach(m => {
    if (m.release_date) {
      const date = m.release_date.split("T")[0]; // normalize date
      dateCount[date] = (dateCount[date] || 0) + 1;
    }
  });

  const barData = {
    labels: Object.keys(dateCount),
    datasets: [
      {
        label: "Movies per Date",
        data: Object.values(dateCount),
        backgroundColor: "#2196F3"
      }
    ]
  };

  return (
    <>
      <h3>Distribusi Genre</h3>
      {Object.keys(genreCount).length > 0 ? (
        <Pie data={pieData} />
      ) : (
        <p>Tidak ada data genre</p>
      )}

      <h3 style={{ marginTop: "30px" }}>Agregasi per Tanggal</h3>
      {Object.keys(dateCount).length > 0 ? (
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#fff"
                }
              }
            },
            scales: {
              x: {
                ticks: { color: "#fff" }
              },
              y: {
                ticks: { color: "#fff" }
              }
            }
          }}
        />
      ) : (
        <p>Tidak ada data tanggal</p>
      )}
    </>
  );
}
