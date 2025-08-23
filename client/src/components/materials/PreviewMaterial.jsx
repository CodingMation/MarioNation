import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaTimes, FaDownload, FaChevronLeft, FaChevronRight, FaExpand, FaImage, FaFileAlt } from 'react-icons/fa';
import fetchApi, { materiallink } from "../../api/fetchApi";

const PreviewMaterial = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");

    const { materialId } = useParams();
    const [materialInfo, setMaterialInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!token) return navigate('/login');
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
    }, [materialId]);

    const handleDownload = () => {
        if (materialInfo.type === 'image' && materialInfo.content) {
            const imageUrl = `${materiallink}/${materialInfo.content}`;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = materialInfo.content;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && imageRef.current) {
            imageRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Error Loading Material</h2>
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
        <div className="h-screen bg-gray-900 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg">
                <button 
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                    <FaChevronLeft className="mr-2" /> Back to Materials
                </button>
                
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-white hidden md:block">
                        {materialInfo.title || 'Material Preview'}
                    </h1>
                    
                    {materialInfo.type === 'image' && materialInfo.content && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Download Image"
                        >
                            <FaDownload className="mr-2" /> Download
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 max-w-5xl md:max-w-xl mx-auto">
                <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center">
                        {materialInfo.type === 'image' ? (
                            <FaImage className="text-2xl text-purple-400 mr-2" />
                        ) : (
                            <FaFileAlt className="text-2xl text-purple-400 mr-2" />
                        )}
                        <h2 className="text-xl font-semibold text-white">
                            {materialInfo.type === 'image' ? 'Image' : 'Text'} Material
                        </h2>
                    </div>
                    
                    <p className="text-gray-400 text-sm">
                        Created: {new Date(materialInfo.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    {materialInfo.type === 'image' ? (
                        <div className="relative">
                            {materialInfo.content ? (
                                <>
                                    <div className="flex justify-center">
                                        <img 
                                            ref={imageRef}
                                            src={`${materiallink}/${materialInfo.content}`} 
                                            alt={materialInfo.title || "Material image"} 
                                            className="max-h-[40vh] max-w-full object-contain rounded-lg shadow-md"
                                        />
                                    </div>
                                    <div className="flex justify-center mt-4 space-x-3">
                                        <button
                                            onClick={toggleFullscreen}
                                            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                        >
                                            <FaExpand className="mr-2" /> 
                                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 bg-gray-700 rounded-lg">
                                    <FaImage className="text-5xl text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">No image content available</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <div className="whitespace-pre-wrap break-words text-gray-200 text-lg leading-relaxed">
                                {materialInfo.content || (
                                    <div className="text-center py-8 text-gray-400">
                                        No text content available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Material Info Footer */}
            {materialInfo.content && (
                <div className="mt-6 max-w-5xl mx-auto bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">Material Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Type: <span className="text-white capitalize">{materialInfo.type}</span></p>
                            <p className="text-gray-400">ID: <span className="text-white font-mono">{materialInfo._id}</span></p>
                        </div>
                        <div>
                            <p className="text-gray-400">Last Updated: <span className="text-white">{new Date(materialInfo.updatedAt).toLocaleString()}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewMaterial;