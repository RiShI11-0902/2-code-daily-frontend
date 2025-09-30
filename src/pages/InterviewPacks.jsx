import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const InterviewPacks = () => {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all packs from API
    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/pack/get`); // your endpoint to fetch all packs
                setPacks(res.data.packs || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching packs:", err);
                setLoading(false);
            }
        };
        fetchPacks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-500">Loading Interview Packs...</p>
            </div>
        );
    }

    if (packs.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-500">No Interview Packs available</p>
            </div>
        );
    }

    return (
           <>
            <Navbar />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Interview Packs</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                    <div
                        key={pack._id}
                        className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl font-semibold mb-2">{pack.packName}</h2>
                        <p className="text-gray-600 mb-1">
                            <span className="font-medium">Language:</span> {pack.language}
                        </p>
                        {pack.framework && (
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Framework:</span> {pack.framework}
                            </p>
                        )}
                        <p className="text-gray-600 mb-3">
                            <span className="font-medium">Questions:</span> {pack.questions.length}
                        </p>
                        {pack.description && (
                            <p className="text-gray-700 mb-4">{pack.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600">₹{pack.price}</span>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
           </>
    );
};

export default InterviewPacks;
