
import Todoschema from "../Schema/Todoschema.js";
import User from "../Schema/userschema.js";
import { sendSMS,makeVoiceCall } from "../Twilio/Twiliomsg.js";


const formatIndianNumber = (number) => {
  const str = number.toString();
  return str.startsWith("+91") ? str : `+91${str}`;
};

export const CreateTodo = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) return res.status(400).json({ message: "Description is required" });
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const newTodo = await Todoschema.create({ description, user: req.user.id });

    try {
      const user = await User.findById(req.user.id);

      if (!user?.phone) {
        console.log("No phone number found for user");
        return;
      }

      const phone = formatIndianNumber(user.phone);

    
      const message = `Hello ${user.name}, your new Todo "${description}" was created successfully. Don't forget to complete it on time!`;
      console.log("Sending SMS:", { phone, message });

      const smsResult = await sendSMS(phone, message);
      console.log("SMS queued:", smsResult.sid, smsResult.status);

      if (smsResult.client && smsResult.sid) {
        const updated = await smsResult.client.messages(smsResult.sid).fetch();
        console.log("Final Status:", updated.status);
      }

  
      const twimlUrl = `${process.env.SERVER_URL}/voice-created?todo=${encodeURIComponent(description)}&name=${encodeURIComponent(user.name)}`;
      const callResult = await makeVoiceCall(phone, twimlUrl);
      console.log("Voice call initiated:", callResult.sid);

    } catch (notifyError) {
      console.error("Notification failed (SMS or Call):", notifyError.message || notifyError);
    }

    res.status(201).json({ message: "Todo created successfully. User has been notified via SMS and call.", todo: newTodo });

  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const Alltodo = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const todos = await Todoschema.find({ user: userId }).sort({ createdAt: -1 })
;
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const GetTodobyid = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const todo = await Todoschema.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (!todo.user || todo.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const UpdateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const todo = await Todoschema.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (!todo.user || todo.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();

   

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const Deletebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const todo = await Todoschema.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (!todo.user || todo.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await todo.deleteOne();

    

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};
