import React, { useState, useEffect } from 'react';
import { FaBook, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import fetchApi from '../api/fetchApi';

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const subjectsPerPage = 8;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await fetchApi.get('/subject/subjects');
        if (res.data.success) {
          setSubjects(res.data.subjects);
          setError(null);
        } else {
          setError('Failed to fetch subjects');
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Error loading subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * subjectsPerPage,
    currentPage * subjectsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-800 relative">
        <main className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Header */}
          <section className="mb-8 text-center">
            <h1 className=" text-white text-3xl md:text-4xl font-bold mb-3">All Subjects</h1>
            <p className="text-gray-400">Browse and explore all available subjects</p>
          </section>

          {/* Search */}
          <section className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full max-w-md bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </section>

          {/* Error Message */}
          {error && (
            <div className="bg-gray-500 border-2 border-red-600 rounded-lg p-4 mb-6 text-center text-white">
              {error}
            </div>
          )}

          {/* Subjects Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <FaSpinner className="animate-spin text-4xl text-purple-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Loading subjects...</h3>
              </div>
            ) : paginatedSubjects.length > 0 ? (
              paginatedSubjects.map(subject => (
                <div key={subject._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-40 bg-gradient-to-r from-purple-700 to-blue-600 flex items-center justify-center">
                    <FaBook className="text-5xl text-white opacity-90" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{subject.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Created: {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-white">
                <FaBook className="text-4xl text-purple-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold">No subjects found</h3>
                <p className="text-gray-400">Try adjusting your search</p>
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
    </>
  );
};

export default Home;
