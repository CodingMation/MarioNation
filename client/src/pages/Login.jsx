import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();    
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({}); // store validation errors

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!user.email.trim()) {
            newErrors.email = "Email is required";
            emailRef.current.focus();
        } else if (!user.password.trim()) {
            newErrors.password = "Password is required";
            passwordRef.current.focus();
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        // console.log(`Logging in as ${user.email}`, user);
        login(user, navigate)
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
            <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
                <h2 className="text-4xl font-bold text-center text-white mb-2">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Please login to your account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-200">
                            Email Address
                        </label>
                        <input
                            ref={emailRef}
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={user.email}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-teal-500"} 
                focus:outline-none focus:ring-2`}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-200">
                            Password
                        </label>
                        <input
                            ref={passwordRef}
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={user.password}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border 
                ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-teal-500"} 
                focus:outline-none focus:ring-2`}
                        />
                    </div>

                    {/* Button */}
                    <button className="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
