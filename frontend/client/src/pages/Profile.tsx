import React, { useState } from 'react';
import Aside from '../components/AsideBar';
import { useSelector, useDispatch } from 'react-redux';
import { uploadToCloudinary } from "../helper/cloudinary"; // Ensure this is correctly imported
import { useEffect as reactUseEffect } from 'react';

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
    income: "",
    photo: user.photo || "pfp.jpg", // Include photo in formData
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null); // State to store uploaded photo

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/auth/user?email=${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.user.username,
            email: data.user.email,
            phone: data.user.phone || "",
            expenseID: data.user.expenseID || "",
            partner: data.user.partner || [],
            address: data.user.address || "",
            income: data.user.income || "",
            photo: data.user.photo || "pfp.jpg", // Update photo from backend
          });
          console.log("User data fetched successfully:", data);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.email]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhoto(file); // Store the uploaded file
      console.log("Uploaded file:", file);

      try {
        console.log("Uploading photo to Cloudinary:", file);
        const photoURL = await uploadToCloudinary(file); // Upload photo immediately
        setFormData((prevData) => ({
          ...prevData,
          photo: photoURL, // Update photo in formData
        }));
        console.log("Photo uploaded successfully. URL:", photoURL);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  // Handle Edit Button Click
  const handleEditClick = () => {
    setIsEditing(true);
    console.log("first", isEditing)

  };

  // Handle Save Button Click
  const handleSaveClick = async () => {
    setIsEditing(false);

    try {
      // Prepare updated user data
      const updatedData = {
        ...formData,
      };

      // Send updated data to the backend
      const response = await fetch(`http://localhost:8080/auth/update/${formData.expenseID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedUser = {
          email: updatedData.email,
          expenseID: updatedData.expenseID,
          isLogin: true,
          phone: updatedData.phone,
          photo: updatedData.photo,
          username: updatedData.username,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
        dispatch({ type: "UPDATE_USER", payload: updatedUser }); // Update user in Redux store
        console.log("User data updated successfully:", updatedUser);
      } else {
        console.error("Failed to update user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during save operation:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    console.log("Edit canceled");
  };

  return (
    <div>
      {/* Sidebar */}
      <div className="h-screen w-[13vw] fixed">
        <Aside />
      </div>

      {/* Main Content */}
      <main className="w-[85vw] ml-[13vw] p-8 bg-gray-100 h-screen grid">
        <div className="grid grid-cols-6 gap-8">
          {/* Profile Picture */}
          <div className="col-span-2 flex justify-center items-start">
            <div className="relative">
              <img
                className="h-64 w-64 rounded-full border-4 border-gray-300 shadow-lg cursor-pointer hover:ring-4 hover:ring-blue-500 transition-all duration-300"
                src={formData.photo} // Show updated photo
                alt="Profile Pic"
                onClick={() => setIsEditing(true)} // Open upload module only when clicking on the profile picture
              />
              {isEditing && uploadedPhoto === null && (
                <div className="absolute top-0 left-0 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <label className="block text-gray-700 font-medium mb-2">Upload Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="col-span-4 bg-white rounded-lg shadow-lg p-8">
            {/* Edit Button */}
            {!isEditing && <button
              onClick={handleEditClick}
              className="absolute right-0 mr-24 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Edit
            </button>}
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
                value={formData.income}
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

                  {isEditing && (
                  <>
                    {!formData.searchMode ? (
                    <button
                      onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:8080/auth/all_users'); // Replace with your backend API endpoint
                        const data = await response.json();
                        console.log("Fetched users:", data);
                        setFormData((prevData) => ({
                          ...prevData,
                          allUsers: data, // Store fetched users in formData
                          searchMode: true, // Enable search mode
                        }));
                      } catch (error) {
                        console.error("Error fetching users:", error);
                      }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Partner
                    </button>
                    ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Search Expense ID"
                        onChange={(e) => {
                          const searchQuery = e.target.value.toLowerCase();
                          const filteredUsers = formData.allUsers?.filter((user: any) =>
                            user.expenseID.toLowerCase().includes(searchQuery) // Search by expenseID
                          );
                          setFormData((prevData) => ({
                            ...prevData,
                            searchResults: filteredUsers, // Update search results
                          }));
                        }}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                      <div className="mt-2">
                        {formData.searchResults?.length > 0 ? (
                          formData.searchResults.slice(0, 3).map((result: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                          >
                            <span>{result.username}</span>
                            <button
                            onClick={() => {
                              setFormData((prevData) => ({
                              ...prevData,
                              partner: [...prevData.partner, result.username], // Add partner to the list
                              searchMode: false, // Exit search mode
                              }));
                            }}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                            +
                            </button>
                          </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No results found.</p>
                        )}
                      </div>
                    </>
                    )}
                  </>
                  )}
                </div>
                </div>

              {/* Address */}
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
              {isEditing ? (
                <input
                type="password"
                name="password"
                placeholder="Enter new password"
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              ) : (
                <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500"
                >
                Change Password
                </button>
              )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <>
                <button
                  onClick={handleSaveClick}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="ml-4 mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
function useEffect(effect: () => void, dependencies: any[]) {
  reactUseEffect(effect, dependencies);
}

