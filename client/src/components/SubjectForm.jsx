import React, { useState, useRef } from "react";

const SubjectForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    exercise: "",
  });

  const [errors, setErrors] = useState({});

  const subjectRef = useRef(null);
  const chapterRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      subjectRef.current.focus();
    } else if (!formData.chapter.trim()) {
      newErrors.chapter = "Chapter name is required";
      chapterRef.current.focus();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Form Submitted:", formData);

    // 🔥 send to backend later
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Subject Details
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Please enter subject details
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
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject name"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${errors.subject ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-teal-500"} 
                focus:outline-none focus:ring-2`}
            />
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Chapter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Chapter Name
            </label>
            <input
              ref={chapterRef}
              type="text"
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              placeholder="Enter chapter name"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${errors.chapter ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-teal-500"} 
                focus:outline-none focus:ring-2`}
            />
            {errors.chapter && (
              <p className="text-red-400 text-sm mt-1">{errors.chapter}</p>
            )}
          </div>

          {/* Exercise (Optional) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">
              Exercise <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="exercise"
              value={formData.exercise}
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

export default SubjectForm;