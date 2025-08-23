import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContentManager = () => {
  const [contents, setContents] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    chapter: "",
    exercise: "",
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const res = await axios.get("/api/contents");
    setContents(res.data);
  };

  const filteredData = contents.filter((item) => {
    return (
      (filters.subject === "" || item.subjectName === filters.subject) &&
      (filters.chapter === "" || item.chapterName === filters.chapter) &&
      (filters.exercise === "" || item.exerciseName === filters.exercise)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📂 Content Management</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Subject"
          className="px-3 py-2 border rounded"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Chapter"
          className="px-3 py-2 border rounded"
          value={filters.chapter}
          onChange={(e) => setFilters({ ...filters, chapter: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Exercise"
          className="px-3 py-2 border rounded"
          value={filters.exercise}
          onChange={(e) => setFilters({ ...filters, exercise: e.target.value })}
        />
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded shadow bg-white text-gray-800"
          >
            <h3 className="font-bold text-lg mb-2">
              {item.subjectName} - {item.chapterName} - {item.exerciseName}
            </h3>
            {item.type === "image" ? (
              <img src={item.url} alt="content" className="w-full h-40 object-cover rounded" />
            ) : (
              <p className="text-sm">{item.text}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Uploaded: {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContentManager;