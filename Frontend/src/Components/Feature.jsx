import { FaMicrophone, FaBell, FaTasks } from "react-icons/fa";

export const Feature = () => {
  const features = [
    {
      title: "Voice & Smart Input",
      description:
        "Add, edit, and manage tasks using voice commands or smart text predictions. Quickly create tasks like “Remind me to call John tomorrow at 5 PM” without typing.",
      icon: <FaMicrophone className="text-4xl text-indigo-500 mb-4" />,
    },
    {
      title: "Smart Reminders",
      description:
        "Set intelligent reminders based on time, location, or recurring patterns. Never miss deadlines—get notified exactly when and where you need to.",
      icon: <FaBell className="text-4xl text-green-500 mb-4" />,
    },
    {
      title: "Full CRUD Task Management",
      description:
        "Easily create, read, update, and delete tasks with a smooth interface. Edit deadlines, prioritize tasks, and remove completed items effortlessly.",
      icon: <FaTasks className="text-4xl text-yellow-500 mb-4" />,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 p-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 flex flex-col items-center text-center 
                     shadow-md hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
        >
          {feature.icon}
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-700">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
