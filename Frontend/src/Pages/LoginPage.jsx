import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

export const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setAccessToken } = useAuth();

  const [isRegister, setRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

 
  const handleToggle = () => setRegister(!isRegister);


  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleFileChange = (file) => {
    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone } = formData;

    try {
      const url = isRegister
        ? "https://taskly-s9nt.onrender.com/registerTodo"
        : "https://taskly-s9nt.onrender.com/loginTodo";

      let dataToSend;
      if (isRegister) {
        setUploading(true);
        dataToSend = new FormData();
        dataToSend.append("name", name);
        dataToSend.append("email", email);
        dataToSend.append("password", password);
        dataToSend.append("phone", phone);
        if (selectedFile) dataToSend.append("myfile", selectedFile);
      } else {
        dataToSend = { email, password };
      }

      const { data } = await axios.post(url, dataToSend, {
        withCredentials: true,
        headers: isRegister ? {} : undefined,
      });

      enqueueSnackbar(
        isRegister ? "Registered successfully!" : "Logged in successfully!",
        { variant: "success" }
      );

      if (isRegister && data.user?.photoUrl) {
        setPhotoPreview(data.user.photoUrl);
      }

      if (!isRegister) {
      
        setAccessToken(data.accessToken);
        navigate("/todos");
      }

   
      setFormData({ name: "", email: "", password: "", phone: "" });
      setSelectedFile(null);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response
          ? `Server error: ${err.response.status}`
          : "Network error");
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setUploading(false);
    }
  };


  const handleGoogleLogin = () => {
  
    window.open("https://taskly-s9nt.onrender.com/auth/google", "_self");
  };

  return (
    <>
      <header className="relative bg-[linear-gradient(135deg,#f5f5dc_0%,#fdfdf5_100%)] h-[80px] border-black border-2 w-full flex items-center justify-start px-[10px] sm:justify-center">
        <h1 className="text-4xl text-black font-['Bangers'] [text-shadow:_3px_3px_0_rgb(255,255,255)]">
          Todo App
        </h1>
      </header>

      <section className="flex justify-center items-center h-screen px-3">
        <div className="max-w-[500px] w-full bg-gradient-to-t from-white to-[#f4f7fb] rounded-[40px] p-6 border-[5px] border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
          <div className="text-center font-black text-[30px] text-[#1089d3]">
            {isRegister ? "Sign Up" : "Sign In"}
          </div>

          <form onSubmit={handleSubmit} className="mt-5">
            {isRegister && (
              <>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border-none px-5 py-[15px] rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-[#12B1D1] placeholder:text-[#aaaaaa]"
                />

                {/* Image Upload */}
                <div className="mt-4 flex items-center gap-4">
                  <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
                    {selectedFile || photoPreview ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-full border"
                    />
                  )}
                </div>
              </>
            )}

            <input
              required
              name="email"
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border-none px-5 py-[15px] rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-[#12B1D1] placeholder:text-[#aaaaaa]"
            />

            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border-none px-5 py-[15px] rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-[#12B1D1] placeholder:text-[#aaaaaa]"
            />

            {isRegister && (
              <input
                required
                name="phone"
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white border-none px-5 py-[15px] rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-[#12B1D1] placeholder:text-[#aaaaaa]"
                pattern="[0-9]{10,15}"
                title="Please enter a valid phone number"
              />
            )}

            <input
              type="submit"
              value={isRegister ? "Sign Up" : "Sign In"}
              disabled={uploading}
              className="block cursor-pointer w-full font-bold text-white bg-gradient-to-r from-[#1089d3] to-[#12b1d1] py-[15px] mt-5 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] border-none transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
            />
          </form>

         
          <div className="mt-6">
            <span className="block text-center text-[10px] text-[#aaaaaa]">
              Or {isRegister ? "sign up" : "sign in"} with
            </span>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={handleGoogleLogin}
                className="bg-gradient-to-r from-black to-gray-600 border-[5px] border-white p-1 rounded-full w-10 aspect-square grid place-content-center shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-110 active:scale-90"
              >
                <FcGoogle className="text-xl" />
              </button>
            </div>
          </div>

          <div className="text-center mt-4 text-[11px] text-gray-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={handleToggle}
              className="text-[#0099ff] font-medium hover:underline cursor-pointer text-[20px]"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
