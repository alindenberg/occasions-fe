import { useState } from 'react';
import { Occasion } from "@/types/occasions";

import { getLocalizedDateInputValue } from '@/utils/utils';

function getDefaultDateTime() {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Set to the top of the current hour
    now.setHours(now.getHours() + 2); // Move to the second next top of the hour
    return getLocalizedDateInputValue(now); // Format as 'YYYY-MM-DDTHH:MM'
}

function formatDate(dateString?: string) {
    if (!dateString) {
        return getDefaultDateTime();
    }
    return getLocalizedDateInputValue(new Date(dateString));
}

export default function EditOccasionComponent({ occasion, formSubmitFunction }: { occasion?: Occasion, formSubmitFunction: Function }) {
    const [label, setLabel] = useState(occasion?.label || '');
    const [type, setType] = useState(occasion?.type || 'birthday');
    const [date, setDate] = useState(formatDate(occasion?.date) || getDefaultDateTime());
    const [customInput, setCustomInput] = useState(occasion?.custom_input || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedDate = new Date(date);
        const minDate = new Date()
        if (selectedDate < minDate) {
            alert('Date must be in the future')
            return;
        }
        formSubmitFunction({ label, type, date: selectedDate.toISOString(), customInput });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col p-6 bg-white shadow-lg rounded-lg border-2 border-orange-400"
        >
            <div className="mb-4">
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">Occasion</label>
                <input
                    type="text"
                    id="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 border border-gray-300 block w-full bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 appearance-none"
                >
                    <option value="birthday">Birthday</option>
                    <option value="graduation">Graduation</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="mb-4" onClick={() => document.getElementById('date')?.click()}>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mr-4">Date and Time</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 transform transition duration-500 ease-in-out hover:scale-105"
                />
                <p className="text-xs text-gray-500 mt-1">When you'll be sent the resulting message</p>
            </div>
            <div className="mb-4">
                <label htmlFor="customInput" className="block text-sm font-medium text-gray-700">Custom Input</label>
                <textarea
                    id="customInput"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Lorem ipsum"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 pb-20"
                />
            </div>
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
            >
                Submit
            </button>
        </form>
    );
}
