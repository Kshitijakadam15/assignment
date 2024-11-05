
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import Illustration from '../../assets/illustration.svg';

const schema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = ({ onLogin }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      return {};
    } catch (err) {
      const validationErrors = err.inner.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.path]: curr.message,
        }),
        {}
      );
      return validationErrors;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:1530/login", formData);
      if (response.data.data) {
        localStorage.setItem("token", response.data.data.accessToken);
        onLogin();
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/dashboard");
      } else {
        enqueueSnackbar(response.data.message || "Login failed", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Login failed. Please try again.", { variant: "error" });
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
 <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div className="flex flex-col items-center">
          <div className="text-start">
            <h1
                className="text-2xl xl:text-4xl font-extrabold text-indigo-600"
                style={{ fontFamily: '"Agbalumo", system-ui', fontWeight: "500" }}
              >
                Welcome Back 👋
              </h1>
              <p className="text-[12px] text-gray-500 mt-2">
                Today is a new day. It's your day.
              </p>
              <p className="text-[12px] text-gray-500">
                Sign in and experience exciting weather
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-5">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                {/* Email Input */}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="email"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}

                {/* Password Input */}
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="password"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 tracking-wide font-semibold bg-indigo-700 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                  </svg>
                  <span className="ml-3">Sign In</span>
                </button>

                <p className="text-xs text-gray-600 text-center">
                  2024 - All Rights Reserved by Kshitija
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-white text-center hidden sm:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${Illustration})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
