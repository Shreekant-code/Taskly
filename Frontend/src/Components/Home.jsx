import { NavLink } from "react-router-dom"
export const Home=()=>{
    return(
        <>
    
       <main className="h-[600px] bg-[#f3f4f5] relative overflow-hidden rounded-[20px] flex items-center justify-center">
  <div>
  <h2 className="text-black text-[30px] text-center relative z-10 mt-[30px] font-bold">
    “Little Ticks, Big Wins.”
  </h2>
  <p className="text-black text-center mt-5 relative z-10">Keep tasks simple, clear, and always under control.</p>
<NavLink to="/login">
  <button className="px-6 py-2 font-extrabold text-green-400 uppercase tracking-widest rounded-md border border-green-500 shadow-[0_0_15px_#22c55e] hover:bg-green-500 hover:text-black hover:shadow-[0_0_25px_#22c55e] transition duration-300 relative ml-[100px] mt-[30px] z-50 cursor-pointer">
    Add Task
  </button>
</NavLink>
  </div>
  <div className="h-[500px] z-20">
<img src="/todo app.png" alt="todo_image" className="z-50" />
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    className="absolute top-0 left-0 w-full rotate-180 z-0"
  >
    <path
      fill="#f3f4f5"
      fillOpacity="1"
      className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
      d="M0,320L20,314.7C40,309,80,299,120,277.3C160,256,200,224,240,224C280,224,320,256,360,234.7C400,213,440,139,480,133.3C520,128,560,192,600,202.7C640,213,680,171,720,133.3C760,96,800,64,840,74.7C880,85,920,139,960,176C1000,213,1040,235,1080,250.7C1120,267,1160,277,1200,272C1240,267,1280,245,1320,224C1360,203,1400,181,1420,170.7L1440,160L1440,0L0,0Z"
    ></path>
  </svg>

  {/* Bottom outward wave */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    className="absolute bottom-0 left-0 w-full z-0"
  >
    <path
      fill="#f3f4f5"
      fillOpacity="1"
      className="drop-shadow-[0_-4px_8px_rgba(0,0,0,0.1)]"
      d="M0,320L20,314.7C40,309,80,299,120,277.3C160,256,200,224,240,224C280,224,320,256,360,234.7C400,213,440,139,480,133.3C520,128,560,192,600,202.7C640,213,680,171,720,133.3C760,96,800,64,840,74.7C880,85,920,139,960,176C1000,213,1040,235,1080,250.7C1120,267,1160,277,1200,272C1240,267,1280,245,1320,224C1360,203,1400,181,1420,170.7L1440,160L0,0Z"
    ></path>
  </svg>

  <div className="absolute right-5 bottom-2.5 sm:hidden opacity-8">
  <img src="/todo2.png" alt="second image" />
</div>

</main>


        </>
    )
}