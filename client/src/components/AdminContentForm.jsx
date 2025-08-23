import React, { useState, useRef } from "react";
import axios from "axios";

const AdminContentForm = () => {
  const [formData, setFormData] = useState({
    subjectName: "",
    chapterName: "",
    exerciseName: "",
  });

  const [errors, setErrors] = useState({});
  const subjectRef = useRef(null);
  const chapterRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = "Subject is required";
      subjectRef.current.focus();
    } else if (!formData.chapterName.trim()) {
      newErrors.chapterName = "Chapter name is required";
      chapterRef.current.focus();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("/api/content", formData);
      alert("✅ Content saved successfully!");
      setFormData({ subjectName: "", chapterName: "", exerciseName: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error saving content");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Add Subject / Chapter / Exercise
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter details to create or update
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Subject
            </label>
            <input
              ref={subjectRef}
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder="Enter subject name"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${
                  errors.subjectName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                } 
                focus:outline-none focus:ring-2`}
            />
            {errors.subjectName && (
              <p className="text-red-400 text-sm mt-1">{errors.subjectName}</p>
            )}
          </div>

          {/* Chapter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Chapter
            </label>
            <input
              ref={chapterRef}
              type="text"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleChange}
              placeholder="Enter chapter name"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${
                  errors.chapterName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                } 
                focus:outline-none focus:ring-2`}
            />
            {errors.chapterName && (
              <p className="text-red-400 text-sm mt-1">{errors.chapterName}</p>
            )}
          </div>

          {/* Exercise (Optional) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Exercise <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              placeholder="Enter exercise (optional)"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminContentForm;