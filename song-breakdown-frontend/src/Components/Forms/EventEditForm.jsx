import React, { useState, useEffect } from 'react';

export const EventEditForm = ({ onClose, onUpdateEvent, eventData, onRefresh }) => {
    const [eventName, setEventName] = useState('');
    const [eventNotes, setEventNotes] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [error, setError] = useState('');

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (eventData) {
            setEventName(eventData.name || '');
            setEventNotes(eventData.notes || '');

            const date = new Date(eventData.event_date);
            const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0];

            setEventDate(formattedDate);
            setEventTime(eventData.event_time ? eventData.event_time.slice(0, 5) : '');
        }
    }, [eventData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date(getTodayDate());
        const selectedDate = new Date(eventDate);

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
        if (selectedDate < today) {
            setError(`Event date cannot be before ${today.toISOString().split('T')[0]}`);
            return;
        }
        if (!eventTime) {
            setError('Event time is required');
            return;
        }

        try {
            await onUpdateEvent({
                ...eventData,
                name: eventName,
                notes: eventNotes,
                event_date: eventDate,
                event_time: eventTime,
            });

            setError('');

            if (typeof onRefresh === 'function') {
                onRefresh();
            }

            onClose();
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event. Please try again.');
        }
    };

    return (
        <div>
            <h1 className="text-center text-white text-3xl font-bold p-1">Edit Event</h1>
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
                        min={getTodayDate()}
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
                        Update
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