import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AssignmentsTable() {
  const [rows, setRows] = useState([]);
  const [sortKey, setSortKey] = useState("startDate");
  const [asc, setAsc] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:10000/api/project_assignments");
      const data = Array.isArray(res.data) ? res.data : [];

      // Normalisera till platta fält så tabellen inte bryr sig om backend-struktur.
      const normalized = data.map((d) => ({
        employeeId:
          d.employeeId ??
          d.employee_id?.employee_id ??
          d.employee_id ??
          "N/A",
        employeeName:
          d.employeeName ??
          d.employee_id?.full_name ??
          d.full_name ??
          "N/A",
        projectDescription:
          d.projectDescription ??
          d.project_code?.project_description ??
          d.project_code?.projectDescription ??
          d.project_description ??
          "N/A",
        startDate: d.start_date ?? d.startDate ?? null,
      }));

      setRows(normalized);
    } catch (err) {
      console.error("Error fetching data:", err);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000); // uppdatera var minut
    return () => clearInterval(id);
  }, []);

  const valueForSort = (item, key) => {
    const v = item[key];
    if (key === "startDate") {
      return v ? new Date(v).getTime() : 0;
    }
    return typeof v === "string" ? v.toLowerCase() : v ?? "";
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setAsc(!asc); // toggla riktning om samma kolumn klickas
    } else {
      setSortKey(key);
      setAsc(true); // börja t.ex. stigande när man byter kolumn
    }
  };

  const sorted = [...rows].sort((a, b) => {
    const A = valueForSort(a, sortKey);
    const B = valueForSort(b, sortKey);
    if (A > B) return asc ? 1 : -1;
    if (A < B) return asc ? -1 : 1;
    return 0;
  });

  // Visa senaste 5 (om uppgiften kräver det); annars ta bort .slice(0, 5)
  const view = sorted.slice(0, 5);

  const arrow = (key) =>
    sortKey === key ? (asc ? " ▲" : " ▼") : "";

  return (
    <div style={{ padding: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ff1e1e", color: "#ffd600" }}>
            <th style={{ textAlign: "left", padding: 12, cursor: "pointer" }} onClick={() => handleSort("employeeId")}>
              Employee ID{arrow("employeeId")}
            </th>
            <th style={{ textAlign: "left", padding: 12, cursor: "pointer" }} onClick={() => handleSort("employeeName")}>
              Employee Name{arrow("employeeName")}
            </th>
            <th style={{ textAlign: "left", padding: 12, cursor: "pointer" }} onClick={() => handleSort("projectDescription")}>
              Project Description{arrow("projectDescription")}
            </th>
            <th style={{ textAlign: "left", padding: 12, cursor: "pointer" }} onClick={() => handleSort("startDate")}>
              Start Date{arrow("startDate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {view.length ? (
            view.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? "#0a54a0" : "#1e1e1e", color: "#fff" }}>
                <td style={{ padding: 12 }}>{r.employeeId || "N/A"}</td>
                <td style={{ padding: 12 }}>{r.employeeName || "N/A"}</td>
                <td style={{ padding: 12 }}>{r.projectDescription || "N/A"}</td>
                <td style={{ padding: 12 }}>
                  {r.startDate ? new Date(r.startDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: 12 }}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
