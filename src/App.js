import { useState, useEffect } from "react"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [projects, setProjects] = useState([]);
    const [owner, setOwner] = useState("");
    const [projectName, setProjectName] = useState("");
    const [count, setCount] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_URL);
            setProjects(response.data.projects);

            const countResponse = await axios.get(`${API_URL}/count`);
            setCount(countResponse.data.count);
        } catch (err) {
            console.error("Error fetching projects:", err);
            toast.error("Failed to fetch projects");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const submitProject = async () => {
        try {
            const response = await axios.post(API_URL, { name: owner, message: projectName });
            setProjects([...projects, response.data.project]);
            setOwner("");
            setProjectName("");
            toast.success("Project added!");
            setCount(prevCount => prevCount + 1);
        } catch (err) {
            console.error("Submit Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "An error occurred");
        }
    };

    const deleteProject = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setProjects(projects.filter(p => p.id !== id));
            toast.success("Project deleted");
            setCount(prev => prev - 1);
        } catch (err) {
            console.error("Error deleting project:", err);
            toast.error("Could not delete project");
        }
    };

    const clearProjects = async () => {
        try {
            await axios.delete(API_URL);
            setProjects([]);
            setCount(0);
            toast.success("All projects cleared");
        } catch (err) {
            console.error("Error deleting all projects:", err);
            toast.error("Could not clear projects");
        }
    };

    return (
        <div className={`container ${darkMode ? "dark" : ""}`}>
            <button className="toggle-mode" onClick={() => setDarkMode(prev => !prev)}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <h1>Project Manager</h1>
            <p>Total Projects: {count}</p>

            <div className="input-container">
                <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Your Name"
                />
                <textarea
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Your Project Name"
                />
                <button onClick={submitProject}>Add Project</button>
            </div>

            <table className="project-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Project</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.message}</td>
                            <td>
                                <button className="delete-btn" onClick={() => deleteProject(project.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="clear-btn" onClick={clearProjects}>Delete All Projects</button>

            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}

export default App;
