import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        
        <div>
          <h3 className="text-2xl font-bold mb-4">TodoApp</h3>
          <p className="text-gray-200">
            Organize your tasks, boost productivity, and achieve your goals effortlessly.
          </p>
        </div>

        

       
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded-l-md text-gray-800 flex-1 outline-none"
            />
            <button className="bg-yellow-400 text-gray-800 px-4 rounded-r-md font-semibold hover:bg-yellow-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-300">
        © 2025 TodoApp. All rights reserved.
      </div>
    </footer>
  );
};
