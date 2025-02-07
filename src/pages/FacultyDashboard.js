import React, { useState, useEffect } from 'react';
import '../index.css';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc ,getDocs, doc } from 'firebase/firestore';
import ProfilePhoto from "../media/FacultyDashboard_Placeholder.png"; 
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = () => {
  const [tasks, setTasks] = useState([]); 
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    department: '',
    contactNumber: '',
    profilePhoto: ProfilePhoto,
  });
  const [selectedTask, setSelectedTask] = useState(null); 
  const userId = auth?.currentUser?.uid;

  // Fetch user details
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUser({ 
          fullName: userData.fullName || '',
          email: userData.email || '',
          contactNumber: userData.contactNumber || '',
          department: userData.department || '',
          profilePhoto: userData.profilePhoto || ProfilePhoto,
        });
      });
    };

    fetchUserDetails();
  }, [userId]);

  // Fetch tasks and listen for updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(collection(db, 'task'), (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        const taskData = doc.data();
        if (taskData.assignedTo === userId) { 
          tasksArray.push({ id: doc.id, ...taskData });
        }
      });
      setTasks(tasksArray);
    });

    return () => unsubscribe(); 
  }, [userId]);

  const handleFeedbackClick = (taskId) => {
    setSelectedTask((prev) => (prev === taskId ? null : taskId)); 
  };

  // Function to mark a task as completed
  const handleMarkAsCompleted = async (taskId) => {
    try {
      const taskRef = doc(db, 'task', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
      });
      alert('Task marked as completed successfully!');
    } catch (error) {
      console.error('Error marking task as completed:', error);
      alert('Failed to mark task as completed. Please try again.');
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className={`flex-1 p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 bg-white bg-opacity-90">
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4 hover:scale-105 transition-transform"
          />
          <h2 className="text-3xl font-semibold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Contact: {user.contactNumber}</p>
          <p className="text-gray-600">Department: {user.department}</p>

          {/* Statistics Section */}
          <div className="mt-6 w-full p-4 border-2 border-grey-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
              {/* Total Tasks */}
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow mb-4">
                <h4 className="text-sm text-gray-600">Tasks Assigned</h4>
                <p className="text-lg font-bold">{totalTasks}</p>
              </div>
            </div>

            {/* Completed and Pending Tasks */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
              {/* Completed Tasks */}
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow">
                <h4 className="text-sm text-gray-600">Tasks Completed</h4>
                <p className="text-lg font-bold">{completedTasks}</p>
              </div>

              {/* Pending Tasks */}
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
                <h4 className="text-sm text-gray-600">Pending Tasks</h4>
                <p className="text-lg font-bold">{pendingTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Assigned Tasks</h3>
          {tasks.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>No tasks assigned.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={`bg-white shadow-lg rounded-lg p-4 mb-4 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold text-gray-800">{task.title}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                    style={{
                      minWidth: '80px',
                      height: '30px',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{task.description}</p>
                <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-4">
                  <p  ><strong>Deadline:</strong> {task.deadline}</p>
                  <p><strong>Assigned On:</strong> {task.assignedOn}</p>
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleFeedbackClick(task.id)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    {selectedTask === task.id ? 'Hide Feedback' : 'Show Feedback'}
                  </button>
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleMarkAsCompleted(task.id)}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>

                {/* Feedback Section */}
                {selectedTask === task.id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h5 className="text-lg font-semibold text-gray-800">Feedback from Admin:</h5>
                    {task.feedback ? (
                      <p className="text-gray-600">{task.feedback}</p>
                  ) : (
                  <p className="text-gray-600 italic">No feedback yet.</p>
                )}
                </div>
              )}
              </div>
            ))
          )}
        </div>    
      </div>
    </div>
  );
};

export default StudentDashboard;
