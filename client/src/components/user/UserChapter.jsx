import React, { useState, useEffect, useRef } from 'react';
import { FaBook, FaSpinner, FaChevronLeft, FaChevronRight, FaFile, FaFolder, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaFolderMinus, FaFolderOpen } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import fetchApi, { materiallink } from '../../api/fetchApi';

const UserChapter = () => {
    const { subjectId } = useParams();

    const [chapters, setChapters] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);

                // Fetch chapters
                const chaptersRes = await fetchApi.get(`/chapter/chapters/${subjectId}`);
                if (chaptersRes.data.success) {
                    setChapters(chaptersRes.data.chapters);
                } else {
                    setError('Failed to fetch chapters');
                }

                // Fetch materials
                const materialsRes = await fetchApi.get(`/material/getmaterials/subject/${subjectId}`);
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

        if (subjectId) fetchContent();
    }, [subjectId]);

    // Combine and filter content based on search term and content type
    const allContent = [
        ...chapters.map(item => ({ ...item, types: 'chapter' })),
        ...materials.map(item => ({ ...item, types: 'material' }))
    ];
    // console.log(allContent)
    const filteredContent = allContent.filter(item => {
        const matchesSearch = item.types === 'chapter'
            ? item.chapterName.toLowerCase().includes(searchTerm.toLowerCase())
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

    const getFileIcon = (fileName, itemContent) => {
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
            case 'txt':
                return <FaFileAlt className="text-gray-400 text-5xl" />;
            default:
                return <FaFileAlt className="text-gray-400" />;
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-800 relative">
            <main className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Header */}
                {/* <section className="mb-8 text-center">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">All Chapters</h1>
                    <p className="text-gray-400">Browse chapters and learning materials</p>
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

                            <Link to={(item.types === 'chapter') ? `/exercise/${item._id}` : `/preview/${item._id}`}>
                                <div
                                    key={`${item.types}-${item._id}`}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                >
                                    <div className="h-40 bg-gradient-to-r from-purple-700 to-blue-600 flex items-center justify-center">
                                        {item.types === 'chapter' ? (
                                            <FaFolderOpen className="text-5xl text-white opacity-90" />
                                        ) : (
                                                item.type === 'image' ? (
                                                    <img
                                                        src={`${materiallink}/${item.content}`}
                                                        alt={item.type}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.src = "/fallback.png"; }}
                                                    />
                                                ) : (
                                                    <div className="text-white text-2xl">
                                                        {getFileIcon(item.fileName || 'file', item.content)}
                                                    </div>
                                                )
                                        )}
                                    </div>
                                    <div className="px-4 flex justify-between text-white hover:text-teal-400 w-full">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1 hover:underline">
                                                {(item.types === 'chapter') ? item.chapterName : item.type}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2">
                                                Created: {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
        </div>
    );
};

export default UserChapter;