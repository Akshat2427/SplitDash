import React, { useState } from "react";
import Google from "../features/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setUser } from "../store/user";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  interface UserObject {
    username: string;
    email: string;
    photo: string;
    phone: number;
    expenseID: string;
    partner: Array<string>;
  }

  async function handelSend() {
    try {
      const obj = { authMethod: "Email", email, password, username, isLogin , photo:"" };
      const res = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await res.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      if(data.message === "UserModel not found"){
        alert("User not found");
        setIsLogin(false);
      }
      else if(data.message === "Invalid credentials"){
        alert("Invalid credentials");
      }
      else if(data.message === "UserModel already exists"){
        setIsLogin(true);
        alert("User already exists");
      }
      else if (data.message === "Authenticated" || data.message === "success" || data.message === "User created successfully") {
        
        const userObj: UserObject = {
          username: data.user.username,
          email: data.user.email,
          photo: data.user.photo ?? "",
          phone: data.user.phone ?? 0,
          expenseID: data.user.expenseID,
          partner: data.user.partner ?? [],
        };

        console.log('Dispatching user:', userObj);
        dispatch(setUser(userObj));
        console.log('====================================');
        console.log("user" , user);
        console.log('====================================');
        alert("Success");
        resetForm(); // Reset form fields after successful login/signup
        navigate("/dashboard");
      } else {
        isLogin
          ? alert("Invalid Email or Password")
          : alert("Email already exists");
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error during login/signup:", error);
      alert("An error occurred. Please try again later.");
    }
  }

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md ${
              isLogin
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md ${
              !isLogin
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>
        <div className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handelSend}
            className={`w-full ${
              !isLogin ? "bg-blue-500" : "bg-green-500"
            } text-white py-2 px-4 rounded-md  ${
              !isLogin ? "hover:bg-blue-600" : "hover:bg-green-600"
            } transition`}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <hr />
          <div className="h-5 bg-transparent"></div>
          <Google />
        </div>
      </div>
    </div>
  );
};

export default Login;
