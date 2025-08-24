import React, { useState, useEffect, useRef } from 'react';
import { FaBook, FaSpinner, FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaEdit, FaFile, FaFolder, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import fetchApi from '../../api/fetchApi';

const ExerciseDashboard = () => {
    const { chapterId } = useParams();

    const [exercises, setExercises] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [showAddOptions, setShowAddOptions] = useState(false);

    const itemsPerPage = 8;
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                
                // Fetch exercises
                const exercisesRes = await fetchApi.get(`/exercise/exercises/${chapterId}`);
                if (exercisesRes.data.success) {
                    setExercises(exercisesRes.data.exercises);
                } else {
                    setError('Failed to fetch exercises');
                }
                
                // Fetch materials
                const materialsRes = await fetchApi.get(`/material/getmaterials/chapter/${chapterId}`);
                if (materialsRes.data.success) {
                    setMaterials(materialsRes.data.materials);
                } else {
                    setError('Failed to fetch materials');
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching content:', err);
                setError('Error loading content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (chapterId) fetchContent();
    }, [chapterId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAddOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Combine and filter content based on search term and content type
    const allContent = [
        ...exercises.map(item => ({ ...item, types: 'exercise' })),
        ...materials.map(item => ({ ...item, types: 'material' }))
    ];

    const filteredContent = allContent.filter(item => {
        const matchesSearch = item.types === 'exercise' 
            ? item.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
            : item.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
    const paginatedContent = filteredContent.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            const endpoint = type === 'exercise' ? `/exercise/delete/${id}` : `/material/delete/${id}`;
            const res = await fetchApi.delete(endpoint);
            
            if (res.data.success) {
                if (type === 'exercise') {
                    setExercises(exercises.filter((e) => e._id !== id));
                } else {
                    setMaterials(materials.filter((m) => m._id !== id));
                }
                console.log(res.data.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleAddOptions = () => {
        setShowAddOptions(!showAddOptions);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf className="text-red-500" />;
            case 'doc':
            case 'docx':
                return <FaFileWord className="text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel className="text-green-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage className="text-purple-500" />;
            default:
                return <FaFileAlt className="text-gray-400" />;
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-800 relative">
            <main className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Header */}
                {/* <section className="mb-8 text-center">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">Exercise Content</h1>
                    <p className="text-gray-400">Browse exercises and learning materials</p>
                </section> */}

                {/* Search and Filter */}
                <section className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search content..."
                        className="w-full max-w-md bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </section>

                {/* Error */}
                {error && (
                    <div className="bg-gray-500 border-2 border-red-600 rounded-lg p-4 mb-6 text-center text-white">
                        {error}
                    </div>
                )}

                {/* Content Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-purple-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold text-white">Loading content...</h3>
                        </div>
                    ) : paginatedContent.length > 0 ? (
                        paginatedContent.map(item => (
                            <div
                                key={`${item.types}-${item._id}`}
                                className="bg-gray-800 flex items-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                            >
                                <div className="h-10 bg-gradient-to-r from-purple-700 to-blue-600 flex items-center justify-center">
                                    {item.types === 'exercise' ? (
                                        <FaBook className="text-5xl text-white opacity-90" />
                                    ) : (
                                        <div className="text-white text-2xl">
                                            {getFileIcon(item.fileName || 'file')}
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 flex justify-between text-white hover:text-teal-400 w-full">
                                    <div>
                                        {item.types === 'exercise' ? (
                                            <Link to={`/materials/${item._id}`}>
                                                <h3 className="font-semibold text-lg mb-1 hover:underline">{item.exerciseName}</h3>
                                            </Link>
                                        ) : (
                                            <div>
                                                <Link to={`/previewmaterial/${item._id}`}>
                                                    <h3 className="font-semibold text-lg mb-1 hover:underline">{item.type}</h3>
                                                </Link>
                                                <p className="text-gray-500 italic text-xs truncate max-w-[150px]">
                                                    {item.content}
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-gray-400 text-sm mb-2">
                                            Created: {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            to={item.types === 'exercise' ? `/editexercise/${item._id}` : `/editmaterial/${item._id}`}
                                            className="text-white hover:text-yellow-500"
                                            title={`Edit ${item.types === 'exercise' ? 'Exercise' : 'Material'}`}
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item._id, item.types)}
                                            className="text-white hover:text-red-500"
                                            title={`Delete ${item.types === 'exercise' ? 'Exercise' : 'Material'}`}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-white">
                            <FaBook className="text-4xl text-purple-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold">No content found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex space-x-2">
                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Button with Dropdown Options */}
            <div className="fixed bottom-6 right-6 z-50" ref={dropdownRef}>
                <button
                    onClick={toggleAddOptions}
                    className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                    <FaPlus className="text-xl" />
                </button>
                
                {showAddOptions && (
                    <div className="absolute bottom-16 right-0 bg-gray-700 rounded-lg shadow-lg py-2 w-48">
                        <Link
                            to={`/addmaterial/chapter/${chapterId}`}
                            className="px-4 py-3 flex items-center text-white hover:bg-gray-600 transition-colors"
                            onClick={() => setShowAddOptions(false)}
                        >
                            <FaFile className="mr-3 text-blue-400" />
                            <span>Add Material</span>
                        </Link>
                        <Link
                            to={`/addexercise/${chapterId}`}
                            className="px-4 py-3 flex items-center text-white hover:bg-gray-600 transition-colors"
                            onClick={() => setShowAddOptions(false)}
                        >
                            <FaFolder className="mr-3 text-yellow-400" />
                            <span>Add Exercise</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseDashboard;