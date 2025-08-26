import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaChevronLeft,
  FaExpand,
  FaImage,
  FaFileAlt,
} from "react-icons/fa";
import fetchApi from "../../api/fetchApi";
import ZoomableImage from "./ZoomableImage";

const PreviewMaterial = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");

  const { materialId } = useParams();
  const [materialInfo, setMaterialInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);

  // fetch material on load
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const res = await fetchApi.get(`/material/getmaterial/${materialId}`);
        if (res.data.success) {
          setMaterialInfo(res.data.material);
          setError(null);
        } else {
          setError("Failed to load material");
        }
      } catch (err) {
        console.error("Error fetching material:", err);
        setError("Error loading material. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [materialId, navigate, token]);

  // handle download for images and text only
  const handleDownload = async () => {
    if (!materialInfo.content) {
      alert("No content available for download");
      return;
    }

    try {
      let fileName;

      if (materialInfo.type === "image") {
        // Extract filename from URL
        const urlParts = materialInfo.content.split("/");
        fileName = urlParts[urlParts.length - 1]; // e.g., MarioNation-xxxx.jpg
      } else if (materialInfo.type === "text") {
        fileName = materialInfo.title
          ? `${materialInfo.title}.txt`
          : `MarioNation-${Date.now()}.txt`;
      } else {
        fileName = `download-${Date.now()}`;
      }

      // Show confirm dialog with the actual filename
      if (!confirm(`Do you want to download "${fileName}"?`)) return;

      if (materialInfo.type === "image") {
        const response = await fetch(materialInfo.content);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);

      } else if (materialInfo.type === "text") {
        const blob = new Blob([materialInfo.content], {
          type: "text/plain;charset=utf-8",
        });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error("❌ Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  // fullscreen toggle for images
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && imageRef.current) {
      // enter fullscreen
      imageRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      // only try to exit if actually in fullscreen
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading material...</p>
        </div>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Material
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <FaChevronLeft className="mr-2" /> Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          <FaChevronLeft className="md:mr-2" /> 
          <span className="hidden md:block">Back to Materials</span>
        </button>

        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white hidden md:block">
            {materialInfo.title || "Material Preview"}
          </h1>

          {(materialInfo.type === "image" || materialInfo.type === "text") && (
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Download Material"
            >
              <FaDownload className="md:mr-2" /> 
              <span className="hidden md:block">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 max-w-5xl mx-auto ">
        <div className="flex items-center mb-2 justify-between">
          <div className="flex items-center">
            {materialInfo.type === "image" ? (
              <FaImage className="text-2xl text-purple-400 mr-2" />
            ) : (
              <FaFileAlt className="text-2xl text-purple-400 mr-2" />
            )}
            <h2 className="text-xl font-semibold text-white">
              {materialInfo.type.charAt(0).toUpperCase() +
                materialInfo.type.slice(1)}{" "}
              Material
            </h2>
          </div>

          <p className="text-gray-400 text-sm">
            Created: {new Date(materialInfo.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="border-t border-gray-700 pt-4">
          {/* Image Preview */}
          {materialInfo.type === "image" && (
            <div className="relative">
              {materialInfo.content ? (
                <>
                  <div className="flex justify-center">
                    {/* Fullscreen container */}
                    <div ref={imageRef} className="w-full h-full flex justify-center">
                      <ZoomableImage
                        src={materialInfo.content}
                        alt={materialInfo.title || "Material image"}
                        zoomEnabled={isFullscreen} // pass a prop
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 space-x-3">
                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <FaExpand className="mr-2" />
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-700 rounded-lg">
                  <FaImage className="text-5xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Preview not available</p>
                </div>
              )}
            </div>
          )}


          {/* Text Preview */}
          {materialInfo.type === "text" && (
            <div className="bg-gray-700 p-6 rounded-lg">
              {materialInfo.content ? (
                <div className="whitespace-pre-wrap break-words text-gray-200 text-lg leading-relaxed">
                  {materialInfo.content}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Preview not available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMaterial;
