import { useEffect, useState } from "react";

const API_URL = "https://attendly-cloud.vercel.app";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/session`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error) return <p style={{ padding: 20 }}>Error: {error}</p>;

  // ---------------------------
  // DETAILS VIEW
  // ---------------------------
  if (selectedSession) {
    const s = selectedSession.session_data;

    return (
      <div className="container">
        <button onClick={() => setSelectedSession(null)}>⬅ Back</button>

        <h2>{s.name}</h2>
        <p><b>Status:</b> {s.status}</p>
        <p><b>Group:</b> {s.group.name}</p>
        <p><b>Center:</b> {s.center.name}</p>
        <p><b>Preset:</b> {s.preset.name}</p>
        <p><b>Created At:</b> {new Date(s.createdAt).toLocaleString()}</p>

        <h3>Students ({s.students.length})</h3>
        <ul>
          {s.students.map((st) => (
            <li key={st.id}>
              {st.name} – {st.category}
            </li>
          ))}
        </ul>

        <h3>Attendance ({s.attendedStudents.length})</h3>
        <ul>
          {s.attendedStudents.map((a) => (
            <li key={a.id}>
              {a.studentData.name} → {a.status}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // ---------------------------
  // LIST VIEW
  // ---------------------------
  return (
    <div className="container">
      <h1>Sessions</h1>

      <div className="grid">
        {sessions.map((item) => (
          <div
            key={item.id}
            className="card"
            onClick={() => setSelectedSession(item)}
          >
            <h3>{item.session_data.name}</h3>
            <p>Status: {item.session_data.status}</p>
            <p>Group: {item.session_data.group.name}</p>
            <p>Students: {item.session_data.students.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
