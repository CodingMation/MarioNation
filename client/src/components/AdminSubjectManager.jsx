import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSubjectManager = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await axios.get("/api/subjects");
    setSubjects(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    await axios.delete(`/api/subjects/${id}`);
    fetchSubjects();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📘 Subject Management</h2>

      <table className="w-full border-collapse border border-gray-600">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 border border-gray-600">Subject</th>
            <th className="p-2 border border-gray-600">Chapter</th>
            <th className="p-2 border border-gray-600">Exercise</th>
            <th className="p-2 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => (
            <tr key={subj._id} className="text-center">
              <td className="p-2 border border-gray-600">{subj.subjectName}</td>
              <td className="p-2 border border-gray-600">{subj.chapterName}</td>
              <td className="p-2 border border-gray-600">{subj.exerciseName}</td>
              <td className="p-2 border border-gray-600 space-x-2">
                <button className="bg-blue-600 px-3 py-1 rounded" onClick={() => alert("View")}>
                  View
                </button>
                <button className="bg-yellow-500 px-3 py-1 rounded" onClick={() => alert("Edit")}>
                  Edit
                </button>
                <button className="bg-red-600 px-3 py-1 rounded" onClick={() => handleDelete(subj._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubjectManager;
