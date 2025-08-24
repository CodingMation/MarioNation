import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchApi from "../../api/fetchApi";
import { FaTimes, FaFile, FaFileImage } from "react-icons/fa";

const AddEditMaterial = ({ btnValue, ID, context }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    content: "",
    type: "text",
    file: null,
  });

  const [materialInfo, setMaterialInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  // ---------------- FETCH MATERIAL WHEN EDITING ----------------
  useEffect(() => {
    if (btnValue === "edit" && context === "material" && ID) {
      const fetchMaterial = async () => {
        try {
          setLoading(true);
          const res = await fetchApi.get(`/material/getmaterial/${ID}`);
          if (res.data.success) {
            setFormData({
              content: res.data.material.content,
              type: res.data.material.type,
              file: null,
            });
            setMaterialInfo(res.data.material);
            setError(null);
          } else {
            setError("Failed to fetch material");
          }
        } catch (err) {
          console.error("Error fetching material:", err);
          setError("Error loading material. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchMaterial();
    }
  }, [btnValue, context, ID]);

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0], content: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (formData.type === "text" && !formData.content.trim()) {
      newErrors.content = "Content is required for text type";
    }
    if ((formData.type === "image" || formData.type === "file") && !formData.file && btnValue === "add") {
      newErrors.file = "File is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const data = new FormData();
      data.append("type", formData.type);
      data.append("content", formData.content || "");

      if (formData.type !== "text" && formData.file) {
        data.append("file", formData.file);
      }

      let res;
      if (btnValue === "add") {
        if (context === "exercise") data.append("exerciseId", ID);
        if (context === "chapter") data.append("chapterId", ID);
        if (context === "subject") data.append("subjectId", ID);

        res = await fetchApi.post(`/material/add`, data);
      } else {
        res = await fetchApi.put(`/material/update/${ID}`, data); // here ID = materialId
      }

      if (res.data.success) {
        window.history.back();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving material");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILE PREVIEW ----------------
  const renderFilePreview = () => {
    if (btnValue === "edit" && materialInfo && materialInfo.type !== "text") {
      return (
        <div className="file-preview mt-3">
          <p className="text-gray-200 mb-2">Current file:</p>
          <div className="flex items-center p-3 bg-gray-800 rounded-lg">
            {materialInfo.type === "image" ? (
              <FaFileImage className="text-blue-400 text-xl mr-2" />
            ) : (
              <FaFile className="text-blue-400 text-xl mr-2" />
            )}
            <span className="text-gray-200 truncate">
              {materialInfo.content.split("/").pop()}
            </span>
            <a
              href={`/material/file/${materialInfo._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-teal-400 hover:text-teal-300"
            >
              View
            </a>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 py-8">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute right-3 top-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white shadow-md hover:bg-teal-600 transition duration-200"
        >
          <FaTimes className="text-lg" />
        </button>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {btnValue === "add" ? "Add Material" : "Edit Material"}
        </h2>
        <p className="text-center text-gray-300 mb-6">
          {btnValue === "add" ? "Attach material to this item" : "Update this material"}
        </p>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Select Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                {/* <option value="file">File (PDF/DOC)</option> */}
              </select>
            </div>

            {/* Text input */}
            {formData.type === "text" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Material Content
                </label>
                <textarea
                  ref={inputRef}
                  name="content"
                  placeholder="Enter text content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border ${
                    errors.content
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            )}

            {/* File upload */}
            {(formData.type === "image" || formData.type === "file") && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Upload {formData.type === "image" ? "Image" : "File"}
                </label>
                <input
                  type="file"
                  name="file"
                  accept={formData.type === "image" ? "image/*" : ".pdf,.doc,.docx"}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                />
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
                {renderFilePreview()}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {loading
                ? "Processing..."
                : btnValue === "add"
                ? "Add Material"
                : "Update Material"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditMaterial;