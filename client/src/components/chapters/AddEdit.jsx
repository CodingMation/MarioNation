import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchApi from "../../api/fetchApi";
import { FaTimes } from "react-icons/fa";


const AddEdit = ({ btnValue, ID }) => {
  const [subjectId, setSubjectId]  = useState(ID);
  const chapterId = ID;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ chapterName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  // Fetch chapter data in edit mode
  useEffect(() => {  
    if (btnValue === "edit" && ID) {
      const fetchChapter = async () => {
        try {
          setLoading(true);
          const res = await fetchApi.get(`/chapter/getchapter/${chapterId}`);
          if (res.data.success) {
            setFormData({ chapterName: res.data.chapter.chapterName });
            setSubjectId(res.data.chapter.subjectId)
            setError(null);
          } else {
            setError("Failed to fetch chapter");
          }
        } catch (err) {
          console.error("Error fetching chapter:", err);
          setError("Error loading chapter. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchChapter();
    }
  }, [btnValue, subjectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.chapterName.trim()) {
      newErrors.chapterName = "Chapter name is required";
      inputRef.current.focus();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      let res;
      if (btnValue === "add") {
        res = await fetchApi.post(`/chapter/add`, {
          subjectId,
          chapterName: formData.chapterName,
        });
      } else {
        res = await fetchApi.put(`/chapter/update/${chapterId}`, {
          chapterName: formData.chapterName,
        });
      }
// console.log(res.data)
      if (res.data.success) {
        window.history.back();
        // navigate(`/chapters/${subjectId}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving chapter");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={()=>window.history.back()}
          className="absolute right-3 top-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white shadow-md hover:bg-teal-600 transition duration-200"
        >
          <FaTimes className="text-lg" />
        </button>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {btnValue === "add" ? "Add Chapter" : "Edit Chapter"}
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Link chapter to the subject
        </p>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
                {btnValue === "add" ? "Chapter Name" : "Update Chapter Name"}
              </label>
              <input
                ref={inputRef}
                type="text"
                name="chapterName"
                placeholder={
                  btnValue === "add"
                    ? "Enter Chapter Name"
                    : "Update Chapter Name"
                }
                value={formData.chapterName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border ${
                  errors.chapterName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                } focus:outline-none focus:ring-2`}
              />
              {errors.chapterName && (
                <p className="text-red-500 text-sm mt-1">{errors.chapterName}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition"
            >
              {btnValue === "add" ? "Add Chapter" : "Update Chapter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEdit;