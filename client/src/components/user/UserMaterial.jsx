import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaImage, FaSpinner, FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import fetchApi, { materiallink } from '../../api/fetchApi';

const UserMaterial = () => {
    const { exerciseId, chapterId, subjectId } = useParams();

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    const materialsPerPage = 8;

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                setLoading(true);
                let url = '/material/getmaterials';
                if (exerciseId) url += `/exercise/${exerciseId}`;
                // else if (chapterId) url += `/chapter/${chapterId}`;
                // else if (subjectId) url += `/subject/${subjectId}`;

                const res = await fetchApi.get(url);
                if (res.data.success) {
                    setMaterials(res.data.materials);
                    setError(null);
                } else {
                    setError('Failed to fetch materials');
                }
            } catch (err) {
                console.error('Error fetching materials:', err);
                setError('Error loading materials. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [exerciseId, chapterId, subjectId]);

    const filteredMaterials = materials.filter(material =>
        material.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);
    const paginatedMaterials = filteredMaterials.slice(
        (currentPage - 1) * materialsPerPage,
        currentPage * materialsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;

        try {
            const res = await fetchApi.delete(`/material/delete/${id}`);
            if (res.data.success) {
                setMaterials(materials.filter(m => m._id !== id));
            }
        } catch (err) {
            console.error(err);
            setError('Failed to delete material. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 relative pb-16">
            <main className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <section className="mb-8 text-center">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">All Materials</h1>
                    <p className="text-gray-400">Browse and explore all available materials</p>
                </section>

                {/* Search */}
                <section className="mb-8 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search materials..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-center text-white">
                        {error}
                    </div>
                )}

                {/* Materials Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-purple-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold text-white">Loading materials...</h3>
                        </div>
                    ) : paginatedMaterials.length > 0 ? (
                        paginatedMaterials.map(material => (
                            <Link
                                to={`/preview/${material._id}`}
                                className="text-white hover:text-teal-400 transition-colors"
                                title="View Material"
                            >
                                <div
                                    key={material._id}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
                                >
                                    {/* Material Thumbnail */}
                                    <div className="h-40 w-full relative bg-gradient-to-r from-purple-900 to-blue-800 flex items-center justify-center">
                                        {material.type === 'image' && material.content ? (
                                            <img
                                                src={`${materiallink}/${material.content}`}
                                                alt="Material"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4">
                                                {material.type === 'image' ? (
                                                    <FaImage className="text-5xl text-white opacity-80 mb-2" />
                                                ) : (
                                                    <FaFileAlt className="text-5xl text-white opacity-80 mb-2" />
                                                )}
                                                <span className="text-white text-sm font-medium">
                                                    {material.type.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Material Info */}
                                    <div className="px-4 py-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg truncate max-w-[180px]">
                                                {material.type || 'Untitled Material'}
                                            </h3>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-2">
                                            Created: {new Date(material.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-white">
                            <h3 className="text-xl font-semibold mb-2">No materials found</h3>
                            <p className="text-gray-400">Try adjusting your search or add new materials</p>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex space-x-2">
                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserMaterial;