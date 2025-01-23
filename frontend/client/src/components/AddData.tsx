import React, { useState } from 'react';
import Aside from './AsideBar';
import { useSelector } from 'react-redux';

interface Props {}

function AddData(props: Props) {
    const [customCategory, setCustomCategory] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const user = useSelector((state: any) => state.user);

    const categories = [
        'Food',
        'Travel',
        'Transport',
        'Entertainment',
        'Shopping',
        'Personal',
        'Accommodation',
        'Miscellaneous',
    ];

    const handleCategoryClick = (category: string) => {
        console.log('Category:', category);
        
        setCustomCategory(category);
        setSelectedCategory(category);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            expenseID : user.expenseID,
            item : expenseName,
            amount: parseFloat(amount),
            date,
            category: customCategory || selectedCategory,
            description : description.length > 0 ? description : 'No description provided',
        };

        try {
            const response = await fetch('http://localhost:8080/expense/add-expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage('Expense added successfully!');
                setExpenseName('');
                setAmount('');
                setDate(new Date().toISOString().split('T')[0]);
                setDescription('');
                setCustomCategory('');
                setSelectedCategory('');
            } else {
                setMessage('Failed to add expense. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the expense.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-black h-screen w-[13vw] fixed">
                <Aside />
            </div>
            <div className="w-[85vw] ml-[13vw] p-8 bg-gray-100 h-screen overflow-y-auto">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[80vw]">
                        <div className="mb-6">
                            <h1 className="text-4xl font-extrabold text-gray-800 text-center">Add Expense</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Expense Name */}
                            <div>
                                <label
                                    htmlFor="expenseName"
                                    className="block text-lg font-medium text-gray-700 mb-1"
                                >
                                    Expense Name
                                </label>
                                <input
                                    id="expenseName"
                                    type="text"
                                    value={expenseName}
                                    onChange={(e) => setExpenseName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter expense or item name"
                                    required
                                />
                            </div>

                            {/* Expense Amount */}
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="block text-lg font-medium text-gray-700 mb-1"
                                >
                                    Expense Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-700">Category</h2>
                                <label
                                    htmlFor="customCategory"
                                    className="block text-sm font-medium text-gray-500 mt-2"
                                >
                                    Create Your Own
                                </label>
                                <input
                                    id="customCategory"
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="Category"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                                />
                            </div>
                            <div>
                                {/* <h2 className="text-lg font-medium text-gray-700 mb-2">Popular Categories</h2> */}
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((category) => (
                                        <span
                                            key={category}
                                            onClick={() => handleCategoryClick(category)}
                                            className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${
                                                selectedCategory === category
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                            }`}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-lg font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 text-white text-lg font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                    }`}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>

                            {/* Response Message */}
                            {message && (
                                <div className="mt-4 text-center text-lg font-medium text-gray-600">
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddData;
