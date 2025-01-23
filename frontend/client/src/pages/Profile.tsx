import React, { useState } from 'react';
import Aside from '../components/AsideBar';
import { useSelector, useDispatch } from 'react-redux';

interface Props {}

function Profile(props: Props) {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);  // State to toggle edit mode
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    expenseID: user.expenseID || "",
    partner: user.partner || [],
    address: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Edit Button Click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle Save Button Click
  const handleSaveClick = () => {
    setIsEditing(false);
    // You can dispatch the updated data here to Redux or backend
    console.log("Updated user data:", formData);
    // dispatch(updateUserData(formData)); // Uncomment and implement this dispatch action
  };

  return (
    <div>
      {/* Sidebar */}
      <div className="bg-black h-screen w-[13vw] fixed">
        <Aside />
      </div>

      {/* Main Content */}
      
      <main className="w-[85vw] ml-[13vw] p-8 bg-gray-100 h-screen grid">
        <div className="grid grid-cols-6 gap-8">
          {/* Profile Picture */}
          <div className="col-span-2 flex justify-center items-start">
            <div className="relative">
              <img
                className="h-64 w-64 rounded-full border-4 border-gray-300 shadow-lg"
                src={user.photo   ? user.photo : "pfp.jpg"}
                alt="Profile Pic"
              />
             
            </div>
          </div>

          {/* User Information */}
          <div className="col-span-4 bg-white rounded-lg shadow-lg p-8">
            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              className="absolute right-0 mr-24 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Edit
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 font-acme">Profile Details</h2>

            <div className="grid gap-4">
              {/* Username */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Email */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Email:</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Income:</label>
                <input
                  type="text"
                  name="income"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              {/* Mobile Number */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Mobile:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Expense ID */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Expense ID:</label>
                <input
                  type="text"
                  value={formData.expenseID}
                  readOnly
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Partner Details */}
              <div className="flex items-start">
                <label className="w-32 font-medium text-gray-600">Partner:</label>
                <div className="grid gap-2">
                  {formData.partner?.map((partner: any, index: number) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      {partner}
                    </button>
                  ))}
                  {/* <button
            
              className=" px-4 py-2 bg-pink-400 text-white font-semibold rounded-md hover:bg-pink-700"
            >
              #o855jm
            </button> */}
                </div>
              </div>

              {/* address */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  readOnly={!isEditing}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Change Password */}
              <div className="flex items-center">
                <label className="w-32 font-medium text-gray-600">Password:</label>
                <button className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500">
                  Change Password
                </button>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSaveClick}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
