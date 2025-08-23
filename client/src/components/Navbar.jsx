import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-teal-400">
            MarioNation
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/home" className="hover:text-teal-400 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-teal-400 transition">
              About
            </Link>

            {/* Subjects Dropdown */}
            <div className="relative group">
              <button className="hover:text-teal-400 flex items-center gap-1">
                Subjects <FaChevronDown size={12} />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg hidden group-hover:block">
                <Link to="/create-subject" className="block px-4 py-2 hover:bg-gray-700">
                  Create Subject
                </Link>
                <Link to="/edit-subject" className="block px-4 py-2 hover:bg-gray-700">
                  Edit Subject
                </Link>
                <Link to="/view-subject" className="block px-4 py-2 hover:bg-gray-700">
                  View Subject
                </Link>
              </div>
            </div>

            {/* Images Dropdown */}
            <div className="relative group">
              <button className="hover:text-teal-400 flex items-center gap-1">
                Images <FaChevronDown size={12} />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg hidden group-hover:block">
                <Link to="/insert-image" className="block px-4 py-2 hover:bg-gray-700">
                  Insert Image
                </Link>
                <Link to="/view-image" className="block px-4 py-2 hover:bg-gray-700">
                  View Image
                </Link>
              </div>
            </div>

            <Link to="/contact" className="hover:text-teal-400 transition">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-4 pb-6 space-y-4">
          <Link
            to="/"
            className="block text-lg hover:text-teal-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-lg hover:text-teal-400 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {/* Subjects Accordion */}
          <div>
            <button
              onClick={() => setSubjectOpen(!subjectOpen)}
              className="flex justify-between w-full text-lg hover:text-teal-400"
            >
              Subjects {subjectOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {subjectOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/create-subject" className="block hover:text-teal-400" onClick={() => setIsOpen(false)}>
                  Create Subject
                </Link>
                <Link to="/edit-subject" className="block hover:text-teal-400" onClick={() => setIsOpen(false)}>
                  Edit Subject
                </Link>
                <Link to="/view-subject" className="block hover:text-teal-400" onClick={() => setIsOpen(false)}>
                  View Subject
                </Link>
              </div>
            )}
          </div>

          {/* Images Accordion */}
          <div>
            <button
              onClick={() => setImageOpen(!imageOpen)}
              className="flex justify-between w-full text-lg hover:text-teal-400"
            >
              Images {imageOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {imageOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/insert-image" className="block hover:text-teal-400" onClick={() => setIsOpen(false)}>
                  Insert Image
                </Link>
                <Link to="/view-image" className="block hover:text-teal-400" onClick={() => setIsOpen(false)}>
                  View Image
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className="block text-lg hover:text-teal-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;