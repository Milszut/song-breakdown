import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Link, useNavigate } from "react-router-dom";
import { registerUser, fetchSecurityQuestions } from '../Services/registerService';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { RegistrationSuccessPopup } from '../Components/Forms/RegistrationSuccessPopup.jsx';
import { Footer } from '../Components/Footer.jsx';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        question_id: '',
        answer: ''
    });
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const questions = await fetchSecurityQuestions();
                setSecurityQuestions(questions);
            } catch (error) {
                console.error("Error fetching security questions:", error);
            }
        };
        loadQuestions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const data = await registerUser(
                formData.name,
                formData.lastname,
                formData.email,
                formData.password,
                formData.question_id,
                formData.answer
            );

            if (data.error) {
                setErrorMessage(data.message);
                return;
            }

            setShowPopup(true);
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate('/login');
    };

    return (
        <PageTemplate> 
            <div className="h-full overflow-auto overflow-x-hidden w-full flex flex-col items-center scrollbar-none relative">
                <div className="h-full flex flex-col justify-center w-4/5 lg:w-1/2 2xl:w-1/3 p-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-left">Create an account</h1>
                    <p className="text-black text-md mb-4 text-left">
                        Already have an account? <Link to="/Login" className="text-black underline">Login!</Link>
                    </p>
                    <form className="text-md space-y-2 md:space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="First Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <select
                            name="question_id"
                            value={formData.question_id}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        >
                            <option value="">Select a security question</option>
                            {securityQuestions.map((question) => (
                                <option key={question.id} value={question.id}>
                                    {question.question}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="answer"
                            placeholder="Your answer"
                            value={formData.answer}
                            onChange={handleChange}
                            className="w-full p-1 md:p-3 border-2 border-black placeholder-black rounded-md bg-transparent"
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="w-30 p-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition"
                            >
                                Create Account
                            </button>
                        </div>
                        {errorMessage && ( 
                            <p className="text-red-600 text-center mt-2">{errorMessage}</p>
                        )}
                    </form>
                    <FormTemplate visible={showPopup} onClose={handlePopupClose}>
                        <RegistrationSuccessPopup onClose={handlePopupClose} />
                    </FormTemplate>
                </div>
                <Footer />
            </div>
        </PageTemplate>
    );
};