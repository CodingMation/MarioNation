import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileAlt, FaImage } from "react-icons/fa";

const AdminMaterialForm = () => {
  const [contents, setContents] = useState([]);
  const [formData, setFormData] = useState({
    parentId: "",
    type: "text",
    value: "",
  });

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get("/api/content");
        setContents(res.data);
      } catch (err) {
        console.error("Error fetching contents:", err);
      }
    };
    fetchContents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/materials", formData);
      alert("✅ Study material added!");
      setFormData({ parentId: "", type: "text", value: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error saving material");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          📚 Add Study Material
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Link content to Subject / Chapter / Exercise
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Subject/Chapter/Exercise */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Select Subject / Chapter / Exercise
            </label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">-- Choose Option --</option>
              {contents.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.subjectName} → {c.chapterName || "No Chapter"} →{" "}
                  {c.exerciseName || "No Exercise"}
                </option>
              ))}
            </select>
          </div>

          {/* Material Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Material Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="text">📝 Text</option>
              <option value="image">🖼️ Image</option>
            </select>
          </div>

          {/* Conditional Input */}
          {formData.type === "text" ? (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Enter Text
              </label>
              <textarea
                name="value"
                placeholder="Write content here..."
                value={formData.value}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Image URL
              </label>
              <input
                type="text"
                name="value"
                placeholder="Paste image URL"
                value={formData.value}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition"
          >
            Save Material
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMaterialForm;