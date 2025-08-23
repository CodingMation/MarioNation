import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchApi from "../../api/fetchApi";
import { FaTimes } from "react-icons/fa";

const AddEdit = ({ btnValue, id }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectName: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subjectRef = useRef(null);

  // ✅ fetch data only in edit mode
  useEffect(() => {
    if (btnValue === "edit" && id) {
        // console.log(id)
      const fetchSubjectName = async () => {
        try {
          setLoading(true);
          const res = await fetchApi.get(`/subject/getsubject/${id}`);
          if (res.data.success) {
            setFormData({ subjectName: res.data.subject.name });
            setError(null);
          } else {
            setError("Failed to fetch subject");
          }
        } catch (err) {
          console.error("Error fetching subject:", err);
          setError("Error loading subject. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchSubjectName();
    }
  }, [btnValue, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = "Subject is required";
      subjectRef.current.focus();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      let response;
      if (btnValue === "add") {
        response = await fetchApi.post("/subject/add", formData);
      } else {
        response = await fetchApi.put(`/subject/update/${id}`, formData);
      }

      if (response.data.success) {
        navigate("/admin");
        setFormData({ subjectName: "" });
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving subject");
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
          {btnValue === "add" ? "Add Study Material" : "Edit Study Material"}
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Link content to Subject
        </p>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
              {btnValue === "add" ? "Enter Subject" : "Update Subject Name"}
              </label>
              <input
                ref={subjectRef}
                type="text"
                name="subjectName"
                placeholder={btnValue === "add" ? "Enter Subject" : "Update Subject"}
                value={formData.subjectName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                  ${
                    errors.subjectName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-teal-500"
                  } 
                  focus:outline-none focus:ring-2`}
              />
              {errors.subjectName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subjectName}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition"
            >
              {btnValue === "add" ? "Add Subject" : "Update Subject"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEdit;