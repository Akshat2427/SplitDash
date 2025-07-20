import React from 'react';
// Ensure the correct path to the Aside component
import Aside from '../components/AsideBar'; // Verify the file exists or adjust the path

const Partner: React.FC = () => {
    return (
        <div>
            {/* Sidebar */}
            <div className=" h-screen w-[13vw] fixed">
                <Aside />
            </div>
            <div className='ml-[13vw]'>
            <div className="flex items-center justify-center h-screen">
            <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center">Coming Soon</h1>
            </div>
        </div>
            </div>
        </div>
    );
};

export default Partner;
