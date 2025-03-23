import { useState, useEffect } from "react"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);
    const [darkMode, setDarkMode] = useState(false); // New state

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(API_URL);
            setFeedbacks(response.data.feedbacks);

            const countResponse = await axios.get(`${API_URL}/count`);
            setCount(countResponse.data.count);
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            toast.error("Failed to fetch feedbacks");
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const submitFeedback = async () => {
        try {
            const response = await axios.post(API_URL, { name, message });
            setFeedbacks([...feedbacks, response.data.feedback]);
            setName("");
            setMessage("");
            toast.success("Feedback submitted!");
            setCount(prevCount => prevCount + 1);
        } catch (err) {
            console.error("Submit Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "An error occurred");
        }
    };

    const deleteFeedback = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setFeedbacks(feedbacks.filter(f => f.id !== id));
            toast.success("Feedback deleted");
            setCount(prev => prev - 1);
        } catch (err) {
            console.error("Error deleting feedback:", err);
            toast.error("Could not delete feedback");
        }
    };

    const clearFeedbacks = async () => {
        try {
            await axios.delete(API_URL);
            setFeedbacks([]);
            setCount(0);
            toast.success("All feedbacks cleared");
        } catch (err) {
            console.error("Error deleting all feedbacks:", err);
            toast.error("Could not clear feedbacks");
        }
    };

    return (
        <div className={`container ${darkMode ? "dark" : ""}`}>
            <button className="toggle-mode" onClick={() => setDarkMode(prev => !prev)}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <h1>Feedback Collector List</h1>
            <p>Total Feedbacks: {count}</p>

            <div className="input-container">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                />
                <button onClick={submitFeedback}>Submit Feedback</button>
            </div>

            <table className="project-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Message</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback) => (
                        <tr key={feedback.id}>
                            <td>{feedback.name}</td>
                            <td>{feedback.message}</td>
                            <td>
                                <button className="delete-btn" onClick={() => deleteFeedback(feedback.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="clear-btn" onClick={clearFeedbacks}>Delete All Feedbacks</button>

            {/* Toast Notifications Container */}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}

export default App;
