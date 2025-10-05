
import { useState, useEffect } from "react";
import { useAuth } from "../Context/Auth";
import { useSnackbar } from "notistack";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

export const Todo = () => {
  const { accessToken, loading, api } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [istick, settick] = useState(() => {
    const saved = localStorage.getItem("istick");
    return saved ? JSON.parse(saved) : {};
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
   const [userPhoto, setUserPhoto] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profiledetails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserPhoto(res.data.photoUrl);
      } catch (err) {
        console.error("Failed to fetch profile photo:", err);
        setUserPhoto(null); 
      }
    };

    if (accessToken) fetchProfile();
  }, [accessToken, api]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get("/todo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setTodos(res.data);
      } catch (error) {
        enqueueSnackbar("Failed to fetch todos.", { variant: "error" });
      }
    };
    if (accessToken) fetchTodos();
  }, [accessToken, api, enqueueSnackbar]);

 
  const createTodo = async () => {
    if (!description.trim()) return;
    try {
      const res = await api.post(
        "/create",
        { description },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTodos([res.data.todo, ...todos]);
      setDescription("");
      enqueueSnackbar("Todo created successfully!", { variant: "success" });
    } catch (error) {
      console.error("Create todo failed:", error);
      enqueueSnackbar("Failed to create todo.", { variant: "error" });
    }
  };


  const toggletick = (id) => {
    settick((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("istick", JSON.stringify(updated));
      return updated;
    });
  };


  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

 
  const openModal = (todo) => {
    setEditTodo(todo);
    setEditText(todo.description);
    setIsModalOpen(true);
  };


  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      const res = await api.put(
        `/update/${editTodo._id}`,
        { description: editText },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTodos((prev) =>
        prev.map((t) => (t._id === editTodo._id ? res.data.todo : t))
      );
      enqueueSnackbar("Todo updated!", { variant: "success" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update todo failed:", error);
      enqueueSnackbar("Failed to update todo.", { variant: "error" });
    }
  };


  const deleteTodo = async (id) => {
    if (!id) {
      console.warn("No ID provided to deleteTodo");
      enqueueSnackbar("Invalid todo ID.", { variant: "error" });
      return;
    }

    console.log("Deleting todo ID:", id);

    try {
      const res = await api.delete(`/delete/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Delete response:", res.data);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      enqueueSnackbar("Todo deleted successfully!", { variant: "success" });
    } catch (error) {
      console.error("Delete failed:", error.response || error);
      if (error.response?.status === 404) {
        enqueueSnackbar("Todo not found.", { variant: "warning" });
      } else if (error.response?.status === 403) {
        enqueueSnackbar("Unauthorized to delete this todo.", { variant: "error" });
      } else {
        enqueueSnackbar("Failed to delete todo.", { variant: "error" });
      }
    }
  };

  if (loading) return <div>Checking session...</div>;
  if (!accessToken) return null;

  return (
    <>
 <header className="relative bg-[linear-gradient(135deg,#f5f5dc_0%,#fdfdf5_100%)] h-[80px] border-black border-2 w-full flex items-center justify-start px-[10px] sm:justify-center">
      <h1
        className="text-4xl text-black font-['Bangers'] 
                   [text-shadow:_3px_3px_0_rgb(255,255,255)]"
      >
        Todo App
      </h1>

      <Link to="/profile">
        <div className="absolute top-[20%] right-[30px] w-12 h-12 cursor-pointer rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition">
          <img
            src={userPhoto || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
    </header>


    <section className="mt-10 flex flex-col items-center px-4">
      
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Enter your Todo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && createTodo()}
          required
          className="w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-gray-700"
        />
        <button
          onClick={createTodo}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-md hover:bg-blue-600 transition-colors shadow-md"
        >
          ADD
        </button>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-4 w-full max-w-4xl ">
        {Array.isArray(todos) &&
          todos.map((todo) => (
            <div
              key={todo._id}
              className="p-4 border bg-[linear-gradient(135deg,#f5f5dc_0%,#fdfdf5_100%)] rounded-[10px] w-full bg-white text- shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
            >
             <p
  className={`font-bold ${
    istick[todo._id] ? "line-through text-grey-400" : "text-black"
  }`}
>
  "{todo.description}"
</p>

              <span className="text-xs text-gray-500">
                Created: {formatDateTime(todo.createdAt)}
              </span>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => openModal(todo)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    console.log("Opening delete modal for ID:", todo._id);
                    setDeleteTodoId(todo._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button className="px-2 py-1 rounded flex items-center justify-center">
                  <FaCheckCircle
                    onClick={() => toggletick(todo._id)}
                    className={`cursor-pointer text-2xl ${
                      istick[todo._id] ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
      </div>

   
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[70]">
          <div className="bg-white p-6 rounded shadow-lg w-80 sm:w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Todo</h2>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[80]">
          <div className="bg-white p-6 rounded shadow-lg w-72 sm:w-80 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this todo?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  console.log("Delete confirmed for ID:", deleteTodoId);
                  await deleteTodo(deleteTodoId);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    </>
  );
};
