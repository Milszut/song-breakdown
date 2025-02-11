import React, { useState } from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Footer } from '../Components/Footer.jsx';
import { LuMapPin } from "react-icons/lu";
import { FaPhoneAlt, FaEnvelope, FaDiscord } from "react-icons/fa";
import { sendMessage } from '../Services/contactService.js';
import { Error } from '../Components/Error.jsx';

export const Contact = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (firstName.trim() === '' || lastName.trim() === '') {
            setErrorMessage('First and Last Name cannot be empty!');
            return;
        }
        if (!email.includes('@')) {
            setErrorMessage('Please enter a correct email!');
            return;
        }
        if (message.trim() === '') {
            setErrorMessage('Message cannot be empty!');
            return;
        }
        if (message.length > 250) {
            setErrorMessage('Message cannot exceed 250 characters!');
            return;
        }

        try {
            const response = await sendMessage({
                first_name: firstName,
                last_name: lastName,
                email: email,
                message: message,
            });

            setErrorMessage(response.message);
            setFirstName('');
            setLastName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setErrorMessage('Failed to send message. Please try again later.');
        }
    };

    const closeErrorPopup = () => {
        setErrorMessage('');
    };

    return (
        <PageTemplate>
            <div className="h-full flex w-full flex-col overflow-auto overflow-x-hidden scrollbar-none relative">
                <div className="flex-grow flex flex-col items-center justify-center w-full pb-4">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
                        <div className="w-full flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6">
                            <div className="w-5/6 sm:w-56 sm:h-56 p-2 sm:p-6 border border-black rounded-lg flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2 sm:gap-0">
                                <div className="text-4xl p-2 sm:p-0" aria-label="Address Icon"><LuMapPin /></div>
                                <div className='flex flex-col'>
                                    <h3 className="font-bold text-lg mt-2">ADDRESS</h3>
                                    <p className="text-sm">Beskidzka 7</p>
                                    <p className="text-sm">Rzeszów 35-083</p>
                                </div>
                            </div>
                            <div className="w-5/6 sm:w-56 sm:h-56 p-2 sm:p-6 border border-black rounded-lg flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2 sm:gap-0">
                                <div className="text-4xl p-2 sm:p-0" aria-label="Phone Icon"><FaPhoneAlt /></div>
                                <div className='flex flex-col'>
                                    <h3 className="font-bold text-lg mt-2">PHONE</h3>
                                    <p className="text-sm">+48 534 898 426</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                            <div className="w-5/6 sm:w-56 sm:h-56 p-2 sm:p-6 border border-black rounded-lg flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2 sm:gap-0">
                                <div className="text-4xl p-2 sm:p-0" aria-label="Email Icon"><FaEnvelope /></div>
                                <div className='flex flex-col'>
                                    <h3 className="font-bold text-lg mt-2">EMAIL</h3>
                                    <p className="text-sm">cmochmilosz@gmail.com</p>
                                </div>
                            </div>
                            <div className="w-5/6 sm:w-56 sm:h-56 p-2 sm:p-6 border border-black rounded-lg flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2 sm:gap-0">
                                <div className="text-4xl p-2 sm:p-0" aria-label="Discord Icon"><FaDiscord /></div>
                                <div className='flex flex-col'>
                                    <h3 className="font-bold text-lg mt-2">DISCORD</h3>
                                    <p className="text-sm underline">Join Us!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-5/6 max-w-2xl mt-6 p-4 rounded-lg border border-black">
                        <h2 className="text-2xl font-bold text-center mb-6">Have a question? <br/>Contact Us!</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-wrap gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="flex-1 p-2 border border-black rounded-md text-black bg-transparent placeholder-black focus:outline-none focus:ring focus:ring-yellow-500"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Second Name"
                                    className="flex-1 p-2 border border-black rounded-md text-black bg-transparent placeholder-black focus:outline-none focus:ring focus:ring-yellow-500"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border border-black rounded-md text-black bg-transparent placeholder-black focus:outline-none focus:ring focus:ring-yellow-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <textarea
                                placeholder="Message"
                                className="w-full p-2 border border-black rounded-md text-black bg-transparent placeholder-black focus:outline-none focus:ring focus:ring-yellow-500 h-32 resize-none"
                                value={message}
                                maxLength={250}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
            {errorMessage && <Error message={errorMessage} onClose={closeErrorPopup} />}
        </PageTemplate>
    );
};