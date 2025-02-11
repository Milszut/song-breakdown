import React, { useState } from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../Services/loginService';
import { Footer } from '../Components/Footer.jsx';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const data = await loginUser(email, password);

            if (data.error) {
                setErrorMessage('Check your account name and password, and try again.');
                return;
            }

            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <PageTemplate> 
            <div className="h-full overflow-auto overflow-x-hidden w-full flex flex-col items-center scrollbar-none relative">
                <div className="h-full flex flex-col justify-center w-3/4 lg:w-1/2 2xl:w-1/4 p-4">
                    <h1 className="text-4xl font-bold text-black mb-6 text-center">Login</h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-28 p-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition"
                            >
                                Login
                            </button>
                        </div>
                        {errorMessage && ( 
                            <p className="text-red-600 text-center mt-2">{errorMessage}</p>
                        )}
                    </form>
                    <div className="mt-4 space-y-2 text-center">
                        <p className="text-black">
                            Forgot Password?{' '}
                            <Link to="/ResetPassword" className="underline">
                                Click here
                            </Link>
                        </p>
                        <p className="text-black">
                            Don't have an account?{' '}
                            <Link to="/Register" className="underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
                <Footer />       
            </div> 
        </PageTemplate>
    );
};