import { useState, useEffect } from "react";
import { useAuth } from "../Context/Auth";

export const Profile = () => {
  const { accessToken, api } = useAuth();
  const [user, setUser] = useState({ name: "", email: "", phone: "", photoUrl: "" });
  const [loading, setLoading] = useState(true);


  const GetProfile = async () => {
    try {
      const res = await api.get("/profiledetails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { GetProfile(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <section className="flex justify-center w-full px-4 mt-10">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center md:flex-row md:items-start gap-6 transition-all">
        
        {/* Profile Image */}
        <div className="flex-shrink-0 w-32 h-32 relative">
          <img
            src={user.photoUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 shadow-lg"
          />
        </div>

        {/* User Details */}
        <div className="flex flex-col flex-1 w-full gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-semibold w-24 text-gray-700">Name:</span>
            <span className="text-gray-800 text-lg">{user.name}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-semibold w-24 text-gray-700">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-semibold w-24 text-gray-700">Mobile:</span>
            <span className="text-gray-800">{user.phone}</span>
          </div>

          {/* Optional: Add actions */}
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
