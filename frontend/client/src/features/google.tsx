import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from '../firebase/firebase'; 
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { setUser } from '../store/user';

interface HandelSendProps {
  email: string;
  password: string;
  username: string;
  isLogin: boolean;
  photo: string;
}

interface UserObject {
  username: string;
  email: string;
  photo: string;
  phone: number;
  expenseID: string;
  partner: Array<string>;
}

const Google: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Corrected 'UseSelector' to 'useSelector'
  const user = useSelector((state: any) => state.user);

  // Improved handling of user data after Google login
  async function handelSend({ email, password, username, isLogin, photo }: HandelSendProps) {
    try {
      const obj = { authMethod: "Google", email, password, username, isLogin, photo };
      const res = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await res.json();

      // Check for success responses
      if (data.message === "User created successfully via Google" || 
          data.message === "Google Authenticated" ||
          data.message === "success" || 
          data.message === "UserModel already exists") {
        
        const userObj: UserObject = {
          username: data.user.username,
          email: data.user.email,
          photo: data.user.photo ?? "",
          phone: data.user.phone ?? 0,
          expenseID: data.user.expenseID,
          partner: data.user.partner ?? [],
         
        };

        // Dispatch the user data to the store
      dispatch(setUser(userObj));
  

        // Optionally, navigate to another page (e.g., dashboard)
        navigate("/dashboard");
      }

      console.log('====================================');
      console.log(data);
      console.log('====================================');
    } catch (error) {
      console.log("Error during Google login:", error);
    }
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app); // Initialize Firebase Auth with the app instance

    signInWithPopup(auth, provider)
      .then((result) => {
        // Get the Google Access Token
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // Get the signed-in user info
        const user = result.user;
        console.log("User:", user.displayName);
        console.log("Profile Picture:", user.photoURL);
        console.log("User Email:", user.email);
        console.log("Token:", token);

        // Call the `handelSend` function with the obtained user details
        handelSend({
          email: user.email ?? "",
          password: "",
          username: user.displayName ?? "",
          isLogin: true,
          photo: user.photoURL ?? "",
        });

      }).catch((error) => {
        // Handle Errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log("Error:", errorMessage);
        // Optionally, display error messages to the user
      });
  };

  return (
    <div
      className="w-full mt-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition flex items-center justify-center cursor-pointer"
      onClick={handleGoogleLogin}
    >
      <FaGoogle className="mr-2" /> Login via Google
    </div>
  );
};

export default Google;
