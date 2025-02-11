import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Link, useNavigate } from "react-router-dom";
import { Footer } from '../Components/Footer.jsx';
import { resetPassword } from '../Services/loginService.js';
import { fetchSecurityQuestions } from '../Services/registerService.js';
import { Error } from '../Components/Error.jsx';

export const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        question_id: '',
        answer: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSecurityQuestions = async () => {
            try {
                const questions = await fetchSecurityQuestions();
                setSecurityQuestions(questions);
            } catch (error) {
                setErrorMessage('Failed to load security questions.');
            }
        };

        loadSecurityQuestions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const result = await resetPassword(
                formData.email,
                formData.question_id,
                formData.answer,
                formData.newPassword
            );

            if (result.error) {
                setErrorMessage(result.message);
                return;
            }

            setSuccessMessage('Password reset successfully! Redirecting to login...');
            
            setFormData({
                email: '',
                question_id: '',
                answer: '',
                newPassword: '',
                confirmPassword: ''
            });

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setErrorMessage('Failed to reset password. Please try again later.');
        }
    };

    const closeErrorPopup = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <PageTemplate> 
            <div className="h-full overflow-auto overflow-x-hidden w-full flex flex-col items-center scrollbar-none relative">
                <div className="w-full h-full flex flex-col justify-center sm:w-3/4 lg:w-1/2 2xl:w-1/3 p-8">
                    <h1 className="text-2xl font-bold text-black text-center mb-6">Reset your password</h1>
                    <form className="flex flex-col items-center justify-between space-y-6" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-black bg-transparent text-black rounded-md placeholder-black"
                            required
                        />
                        <select
                            name="question_id"
                            value={formData.question_id}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-black bg-transparent text-black rounded-md placeholder-black"
                            required
                        >
                            <option value="" disabled>Select your security question</option>
                            {securityQuestions.map((q) => (
                                <option key={q.id} value={q.id}>{q.question}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="answer"
                            placeholder="Answer"
                            value={formData.answer}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-black bg-transparent text-black rounded-md placeholder-black"
                            required
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-black bg-transparent text-black rounded-md placeholder-black"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-black bg-transparent text-black rounded-md placeholder-black"
                            required
                        />
                        <div className="w-full md:w-3/4 flex items-center justify-between">
                            <p className="text-black font-bold">
                                <Link to="/Login" className="hover:text-white">
                                    GO BACK TO LOGIN
                                </Link>
                            </p>
                            <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded-md">
                                RESET PASSWORD
                            </button>
                        </div>
                        <hr className="border-black m-4 w-full md:w-3/4" />
                    </form>
                    <div className="mt-4">
                        <p className="text-black mb-4 text-center">
                            Don't have an account?  
                        </p>
                        <p className="text-black font-bold text-center">
                            <Link to="/Register" className="hover:text-white">
                                REGISTER
                            </Link>
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
            {(errorMessage || successMessage) && <Error message={errorMessage || successMessage} onClose={closeErrorPopup} />}
        </PageTemplate>
    );
};