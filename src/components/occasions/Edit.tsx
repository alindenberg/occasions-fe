import { useState } from 'react';
import { Occasion } from "@/types/occasions";

function getDefaultDateTime() {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Set to the top of the current hour
    now.setHours(now.getHours() + 2); // Move to the second next top of the hour
    return now.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
}

export default function EditOccasionComponent({ occasion, formSubmitFunction }: { occasion?: Occasion, formSubmitFunction: Function }) {
    const [label, setLabel] = useState(occasion?.type || '');
    const [type, setType] = useState(occasion?.type || 'birthday');
    const [date, setDate] = useState(occasion?.date || getDefaultDateTime());
    const [customInput, setCustomInput] = useState(occasion?.custom_input || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedDate = new Date(date);
        const minDate = new Date()
        if (selectedDate < minDate) {
            console.error('Date must be in the future');
            return;
        }

        formSubmitFunction({ label, type, date, customInput });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col border-2 border-yellow-700">
            <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label</label>
                <input
                    type="text"
                    id="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="birthday">Birthday</option>
                    <option value="graduation">Graduation</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="customInput" className="block text-sm font-medium text-gray-700">Custom Input</label>
                <input
                    type="text"
                    id="customInput"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Submit
            </button>
        </form>
    );
}