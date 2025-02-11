import React, { useState } from 'react';

export const EventAddForm = ({ onClose, onAddEvent }) => {
    const [eventName, setEventName] = useState('');
    const [eventNotes, setEventNotes] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (eventName.trim() === '') {
            setError('Event name cannot be empty');
            return;
        }
        if (eventName.length > 50) {
            setError('Event name cannot exceed 50 characters');
            return;
        }
        if (eventNotes.length > 150) {
            setError('Notes cannot exceed 150 characters');
            return;
        }
        if (!eventDate) {
            setError('Event date is required');
            return;
        }
        if (!eventTime) {
            setError('Event time is required');
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(`${eventDate}T${eventTime}`);

        if (selectedDate < currentDate) {
            setError('Event date and time cannot be in the past');
            return;
        }

        onAddEvent({ name: eventName, notes: eventNotes, event_date: eventDate, event_time: eventTime });
        setError('');
        onClose();
    };

    return (
        <div>
            <h1 className="text-center text-white text-3xl font-bold p-1">Create New Event</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Event Name</label>
                    <input
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter Event Name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Notes (optional, max 150 characters)</label>
                    <textarea
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter Notes"
                        value={eventNotes}
                        maxLength={150}
                        rows={4}
                        onChange={(e) => setEventNotes(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Event Date</label>
                    <input
                        type="date"
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Event Time</label>
                    <input
                        type="time"
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex items-center gap-8 justify-center">
                    <button
                        type="submit"
                        className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
                    >
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#CC8111] hover:bg-[#966213] text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};