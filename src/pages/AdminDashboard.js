import React, { useState, useEffect } from 'react';
import '../index.css';
import { db } from '../firebase';
import { query, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Trash2 } from 'lucide-react';
import AdminProfiePhoto from "../media/Admin_placeholder.jpg";
import { useNavigate } from 'react-router-dom'; 

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]); 
  const [users, setUsers] = useState({});
  const [filterFacultyName, setFilterFacultyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]); 
  const [filterPriority, setFilterPriority] = useState("");
  const navigate = useNavigate(); 
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: AdminProfiePhoto,
  });
  const [feedbacks, setFeedbacks] = useState({});

  const handleAddTaskClick = () => {
    navigate('/assigntask');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast.error("No user is logged in.");
          return;
        }

        const loggedInEmail = user.email;

        // Fetch tasks from the "task" collection
        const tasksSnapshot = await getDocs(collection(db, "task"));
        const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Tasks (Admin):", tasksList);
        setTasks(tasksList);
        setFilteredTasks(tasksList);

        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = {};
        usersSnapshot.forEach((doc) => {
          usersList[doc.id] = doc.data();
        });
        setUsers(usersList);

        // Fetch admin details
        const adminQuery = query(collection(db, "users"), where("email", "==", loggedInEmail), where("role", "==", "admin"));
        const adminSnapshot = await getDocs(adminQuery);
        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setAdmin({
            firstName: adminData.firstName || '',
            lastName: adminData.lastName || '',
            email: adminData.email || '',
            profilePhoto: adminData.profilePhoto || AdminProfiePhoto,
          });
        } else {
          console.error("No admin found in the database.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    let filtered = tasks;
  
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (filterStatus) {
      filtered = filtered.filter(task => task.status.toLowerCase() === filterStatus.toLowerCase());
    }
  
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority.toLowerCase() === filterPriority.toLowerCase());
    }
  
    if (filterFacultyName) {
      filtered = filtered.filter(task => {
        const assignedFaculty = users[task.assignedTo]?.fullName || '';
        return assignedFaculty.toLowerCase().includes(filterFacultyName.toLowerCase());
      });
    }
  
    setFilteredTasks(filtered);
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const taskRef = doc(db, "task", id);
      await updateDoc(taskRef, {
        feedback: null,
      });

      toast.success("Feedback deleted successfully!");

      const querySnapshot = await getDocs(collection(db, "task"));
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksList);
      setFilteredTasks(tasksList);
    } catch (error) {
      toast.error("Error deleting feedback");
      console.error("Error deleting feedback:", error);
    }
  };

  const handleAddFeedback = async (taskId) => {
    if (!feedbacks[taskId]) {
      toast.error("Please provide feedback!");
      return;
    }
  
    try {
      const taskRef = doc(db, "task", taskId);
      await updateDoc(taskRef, {
        feedback: feedbacks[taskId],
      });
  
      toast.success("Feedback added successfully!");
  
      // Clear the feedback input
      setFeedbacks((prevFeedbacks) => ({
        ...prevFeedbacks,
        [taskId]: "",
      }));
  
      // Refresh tasks after adding feedback
      const querySnapshot = await getDocs(collection(db, "task"));
      const tasksList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
      setFilteredTasks(tasksList);
    } catch (error) {
      toast.error("Error adding feedback");
      console.error("Error adding feedback:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  const chartDataStatus = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const priorityData = tasks.reduce((acc, task) => {
    const priority = task.priority || 'Unknown';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  const chartDataPriority = {
    labels: Object.keys(priorityData),
    datasets: [
      {
        data: Object.values(priorityData),
        backgroundColor: ['#FFB830', '#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2'],
        hoverBackgroundColor: ['#FFB830', '#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2'],
      },
    ],
  };

  const handleFeedbackChange = (id, value) => {
    setFeedbacks((prevFeedbacks) => ({
      ...prevFeedbacks,
      [id]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center mt-4 sm:mt-0">
            <img
              src={admin.profilePhoto}
              alt="Admin Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{`${admin.firstName} ${admin.lastName}`}</h2>
              <p className="text-gray-500 text-sm">{admin.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Total Tasks</h4>
            <p className="text-lg font-bold">{totalTasks}</p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Completed Tasks</h4>
            <p className="text-lg font-bold">{completedTasks}</p>
          </div>
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Pending Tasks</h4>
            <p className="text-lg font-bold">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Filters and Pie Chart Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Filter Section */}
        <div className="p-6 bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Filters</h3>

          <input
            type="text"
            placeholder="Search Tasks"
            className="w-full p-2 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

<input
  type="text"
  placeholder="Filter by Faculty Name"
  className="w-full p-2 border rounded mb-4"
  value={filterFacultyName}
  onChange={(e) => setFilterFacultyName(e.target.value)}
/>

          <select
            className="w-full p-2 border rounded mb-4"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            className="w-full p-2 border rounded mb-4"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-8"
          >
            Search
          </button>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("");
                setFilterPriority("");
                setFilterFacultyName("");
                setFilteredTasks(tasks);
              }}
              className="bg-gray-500 text-white text-sm py-1 px-2 rounded hover:bg-gray-600 ml-auto"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="p-6 bg-green-50 border-2 border-green-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
          <div className="flex flex-wrap justify-between">
            <div className="w-full sm:w-1/2 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Task Status</h4>
              <Pie data={chartDataStatus} />
            </div>
            <div className="w-full sm:w-1/2 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Task Priorities</h4>
              <Pie data={chartDataPriority} />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-blue-100 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
          <button
        onClick={handleAddTaskClick} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
        </div>

        <div className="space-y-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-md transition-transform transform hover:scale-102">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold">{task.title}</h4>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {task.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>

              <p className="text-lg mb-4">{task.description}</p>

              {/* Display Assigned Date, Priority, and Submitted By */}
              <div className="flex flex-wrap space-x-4 text-sm text-gray-600 mb-4">
                <p><strong>Assigned On:</strong> {task.assignedOn || 'Invalid Date'}</p>
                <p><strong>Assigned To Faculty:</strong> {users[task.assignedTo]?.fullName || 'Not Assigned'}</p>
                <p><strong>Deadline:</strong>{task.deadline || 'unknown'}</p>
                <p><strong>Priority: </strong>
                  <span
                    className={`px-1 py-1 rounded text-white font-semibold ${
                      task.priority === 'High'
                        ? 'bg-red-500'
                        : task.priority === 'Medium'
                        ? 'bg-yellow-500'
                        : task.priority === 'Low'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {task.priority || 'Not specified'}
                  </span>
                </p>
              </div>

              {/* Feedback Section with Delete Option */}
              {task.feedback && (
                <div className="mt-4 mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-gray-700">Feedback added: </h5>
                      <p className="text-gray-600">{task.feedback}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFeedback(task.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Delete feedback"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add Feedback Input */}
              <textarea
                placeholder="Add Feedback"
                className="w-full p-2 border rounded mb-4"
                value={feedbacks[task.id] || ''}
                onChange={(e) => handleFeedbackChange(task.id, e.target.value)}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <button
                  onClick={() => handleAddFeedback(task.id)}
                  className="bg-dark-blue-600 text-white py-2 px-4 rounded mb-4 sm:mb-0 hover:bg-dark-blue"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
