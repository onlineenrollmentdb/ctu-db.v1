import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../css/GradesPage.css";
import { useToast } from "../context/ToastContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GradesPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("student"));
    if (user) setStudent(user);
    else addToast("⚠️ No logged-in student found in localStorage", "warning");
  }, [addToast]);

  useEffect(() => {
    if (!student) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/academic/academic-history/${student.student_id}`
        );
        setSubjects(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching grades:", err);
        addToast("❌ Error fetching grades. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [student, addToast]);

  // 📊 Stats
  const gradedSubjects = subjects.filter(
    (s) => s.grade !== null && s.grade !== ""
  );
  const avgGrade =
    gradedSubjects.length > 0
      ? (
          gradedSubjects.reduce((sum, s) => sum + parseFloat(s.grade || 0), 0) /
          gradedSubjects.length
        ).toFixed(2)
      : null;

  const totalSubjects = subjects.length;
  const passed = subjects.filter((s) => s.status === "Passed").length;
  const failed = subjects.filter((s) => s.status === "Failed").length;

  // 📈 Average per year + semester
  const semesterMap = {};
  gradedSubjects.forEach((s) => {
    const sem = s.semester || s.subject_semester || "?"; // use backend value directly
    const key = `${s.year_level || "?"}-${sem}`;

    if (!semesterMap[key]) {
      semesterMap[key] = {
        year_level: s.year_level || "?",
        semester: sem,
        grades: [],
      };
    }
    semesterMap[key].grades.push(parseFloat(s.grade));
  });

  const chartData = Object.values(semesterMap)
    .map((entry) => {
      const avg =
        entry.grades.reduce((sum, g) => sum + g, 0) / entry.grades.length;
      return {
        name: `${entry.year_level} Year ${entry.semester} Sem`, // now uses backend value
        grade: parseFloat(avg.toFixed(2)),
        year_level: entry.year_level,
        semester: entry.semester,
      };
    })
    .sort((a, b) => {
      const yearA = parseInt(a.year_level) || 0;
      const yearB = parseInt(b.year_level) || 0;
      if (yearA !== yearB) return yearA - yearB;

      const semOrder = { "1st": 1, "2nd": 2 };
      const semA = semOrder[a.semester] || 0;
      const semB = semOrder[b.semester] || 0;
      return semA - semB;
    });

  // 📚 Group subjects by Year + Semester for table
  const groupedSubjects = Object.entries(
    [...subjects].reduce((groups, subj) => {
      const sem =
        subj.semester === "1st" || subj.semester === "2nd"
          ? subj.semester
          : "?";
      const key = `Year ${subj.year_level || "?"} - ${sem} Semester`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(subj);
      return groups;
    }, {})
  );

  return (
    <div className="grades-page">
      <div className="grades-dashboard">
        <h4>GRADES OVERVIEW</h4>

        {!student ? (
          <p>⚠️ No logged-in student detected</p>
        ) : (
          <div className="grades-grid">
            {/* Top stats */}
            <div className="grades-card avg">
              Average Grade <p>{avgGrade ?? "—"}</p>
            </div>
            <div className="grades-card total">
              Total Subjects <p>{totalSubjects || "—"}</p>
            </div>
            <div className="grades-card passed">
              Passed <p>{passed || "—"}</p>
            </div>
            <div className="grades-card failed">
              Failed <p>{failed || "—"}</p>
            </div>

            {/* Graph bottom-left */}
            <div className="grades-card graph">
              <h3>Grade Trend (Per Semester)</h3>
              {chartData.length === 0 ? (
                <p>No Grades detected</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[1, 5]} reversed />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="grade"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Subjects list bottom-right */}
            <div className="grades-card subjects modern-table">
              <h3>Subjects List</h3>
              {loading ? (
                <p>Loading...</p>
              ) : totalSubjects === 0 ? (
                <p>No Grades detected</p>
              ) : (
                <div className="modern-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Units</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedSubjects.map(([group, records], idx) => {
                        const sortedRecords = records.sort((a, b) => {
                          const codeA = a.subject_section || "";
                          const codeB = b.subject_section || "";
                          return codeA.localeCompare(codeB);
                        });

                        return (
                          <React.Fragment key={group}>
                            {idx > 0 && (
                              <tr>
                                <td colSpan={7} className="semester-divider"></td>
                              </tr>
                            )}

                            <tr>
                              <td colSpan={7} className="group-cell">
                                {group}
                              </td>
                            </tr>

                            {sortedRecords.map((s, i) => (
                              <tr key={`${group}-${i}`}>
                                <td>{s.subject_code}</td>
                                <td>{s.subject_desc || "—"}</td>
                                <td>{s.units || "—"}</td>
                                <td>{s.grade ?? "—"}</td>
                                <td>{s.status ?? "—"}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
