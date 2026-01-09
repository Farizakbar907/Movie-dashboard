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
    fetchSummary();
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
  
  const fetchSummary = async () => {
  try {
    const res = await api.get("/movies");
    setMovies(res.data); // <-- SIMPAN ARRAY, BUKAN LENGTH
  } catch (err) {
    console.error(err);
  }
};

// ===== BAR CHART DATA (1 BULAN TERAKHIR) =====
const dateCount = {};

lastMonth.forEach(m => {
  if (m.release_date) {
    const date = m.release_date.split("T")[0];
    dateCount[date] = (dateCount[date] || 0) + 1;
  }
});

const dateMap = {};

lastMonth.forEach(m => {
  if (!m.release_date) return;

  const date = m.release_date.split("T")[0];

  if (!dateMap[date]) {
    dateMap[date] = {
      count: 0,
      titles: []
    };
  }

  dateMap[date].count++;
  dateMap[date].titles.push(m.title);
});

const barData = {
  labels: Object.keys(dateMap),
  datasets: [
    {
      label: "Jumlah Film",
      data: Object.values(dateMap).map(v => v.count),
      backgroundColor: "#2196F3",
      borderRadius: 5
    }
  ]
};

const barOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const date = context.label;
          const info = dateMap[date];

          return [
            `Jumlah: ${info.count}`,
            `Film:`,
            ...info.titles
          ];
        }
      }
    },
    legend: {
      labels: { color: "#fff" }
    }
  },
  scales: {
    x: { ticks: { color: "#fff" } },
    y: { ticks: { color: "#fff" } }
  }
};


  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      {/* ===== TITLE ===== */}
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {/* ===== SUMMARY CARD ===== */}
      <div
        style={{
          background: "#2b2b2b",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}
      >
        <h4 style={{ margin: 0, color: "#bbb" }}>Total Movies</h4>
        <h2 style={{ marginTop: "5px" }}>{movies.length}</h2>
      </div>

      {/* ===== DATE FILTER ===== */}
      <div
        style={{
          background: "#2b2b2b",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}
      >
        <h4 style={{ marginBottom: "10px" }}>Filter Tanggal</h4>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div>
            <label>Start Date</label>
            <br />
            <input
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
            />
          </div>

          <div>
            <label>End Date</label>
            <br />
            <input
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
            />
          </div>
        </div>
      </div>
{/* ===== CHART SECTION ===== */}
<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

  {/* ===== PIE CHART ===== */}
  <div
    style={{
      flex: "1",
      background: "#2b2b2b",
      padding: "15px",
      borderRadius: "8px"
    }}
  >
    <h4 style={{ marginBottom: "10px" }}>Distribusi Genre</h4>

    <Pie
      data={{
        labels: Object.keys(genreCount),
        datasets: [
          {
            data: Object.values(genreCount),
            backgroundColor: [
              "#4CAF50",
              "#2196F3",
              "#FFC107",
              "#E91E63"
            ]
          }
        ]
      }}
    />
  </div>

  {/* ===== BAR CHART ===== */}
  <div
    style={{
      flex: "2",
      background: "#2b2b2b",
      padding: "15px",
      borderRadius: "8px"
    }}
  >
    <h4 style={{ marginBottom: "10px" }}>
      Film 1 Bulan Terakhir
    </h4>

    <Bar
      data={barData}
      options={barOptions}
    />
  </div>

</div>

       </div>
  );
}