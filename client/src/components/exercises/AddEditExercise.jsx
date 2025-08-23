import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchApi from "../../api/fetchApi";
import { FaTimes } from "react-icons/fa";

const AddEditExercise = ({ btnValue, ID }) => {
  const navigate = useNavigate();
  const [chapterId, setChapterId] = useState(ID); // chapter ID to which exercise belongs
  const exerciseId = btnValue === "edit" ? ID : null;

  const [formData, setFormData] = useState({ exerciseName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  // Fetch exercise data in edit mode
  useEffect(() => {
    if (btnValue === "edit" && exerciseId) {
      const fetchExercise = async () => {
        try {
          setLoading(true);
          const res = await fetchApi.get(`/exercise/getexercise/${exerciseId}`);
          if (res.data.success) {
            setFormData({ exerciseName: res.data.exercise.exerciseName });
            setChapterId(res.data.exercise.chapterId);
            setError(null);
          } else {
            setError("Failed to fetch exercise");
          }
        } catch (err) {
          console.error("Error fetching exercise:", err);
          setError("Error loading exercise. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchExercise();
    }
  }, [btnValue, exerciseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.exerciseName.trim()) {
      newErrors.exerciseName = "Exercise name is required";
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
        res = await fetchApi.post(`/exercise/add`, {
          chapterId,
          exerciseName: formData.exerciseName,
        });
      } else {
        res = await fetchApi.put(`/exercise/update/${exerciseId}`, {
          exerciseName: formData.exerciseName,
        });
      }
      console.log(res.data);
      if (res.data.success) {
        window.history.back();
        // navigate(`/exercises/${chapterId}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving exercise");
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
          {btnValue === "add" ? "Add Exercise" : "Edit Exercise"}
        </h2>
        <p className="text-center text-gray-300 mb-6">Link exercise to the chapter</p>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
                {btnValue === "add" ? "Exercise Name" : "Update Exercise Name"}
              </label>
              <input
                ref={inputRef}
                type="text"
                name="exerciseName"
                placeholder={btnValue === "add" ? "Enter Exercise Name" : "Update Exercise Name"}
                value={formData.exerciseName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border ${
                  errors.exerciseName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                } focus:outline-none focus:ring-2`}
              />
              {errors.exerciseName && (
                <p className="text-red-500 text-sm mt-1">{errors.exerciseName}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition"
            >
              {btnValue === "add" ? "Add Exercise" : "Update Exercise"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditExercise;