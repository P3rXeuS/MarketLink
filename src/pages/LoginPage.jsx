import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Input, Label, Description } from "@headlessui/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleLogin = () => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      toast.info("Logging in...", { autoClose: 1500 });
      setTimeout(() => {
        localStorage.setItem("token", user.id);
        localStorage.setItem("userEmail", email);
        toast.success("Login successful!", { autoClose: 2000 });
        navigate("/");
      }, 1500);
    } else {
      setError("Invalid email or password. Please try again.");
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
      />
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h1>
        <Field>
          <Label className="text-sm font-medium text-black">Email</Label>
          <Description className="text-sm text-black/80">
            Enter your email to log in.
          </Description>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              "mt-3 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-lg text-black",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          />
        </Field>

        <Field className="mt-4">
          <Label className="text-sm font-medium text-black">Password</Label>
          <Description className="text-sm text-black/80">
            Your password should be at least 8 characters long.
          </Description>
          <div className="relative mt-3">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={clsx(
                "block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 pr-12 text-lg text-black",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center"
            >
              {showPassword ? (
                <FaRegEyeSlash className="w-5 h-5 text-gray-500" />
              ) : (
                <FaRegEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </Field>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="mt-6 w-full py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
