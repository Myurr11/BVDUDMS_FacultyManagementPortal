import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";

const AssignTask = () => {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "", 
    priority: "Low",
    agreement: false,
    deadline: "", 
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.role === "faculty"); 
  
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        setModalMessage("Error fetching users. Please try again.");
        setShowModal(true);
      }
    };
  
    fetchUsers();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const closeModal = () => setShowModal(false);

  const validateFields = () => {
    if (!formData.title || formData.title.trim() === "") {
      setModalMessage("Please enter a valid title.");
      setShowModal(true);
      return false;
    }

    if (!formData.description || formData.description.trim() === "") {
      setModalMessage("Please provide a description for the task.");
      setShowModal(true);
      return false;
    }

    if (!formData.assignedTo || formData.assignedTo === "") {
      setModalMessage("Please select a faculty member to assign the task.");
      setShowModal(true);
      return false;
    }

    if (!formData.priority || formData.priority === "") {
      setModalMessage("Please select a priority level.");
      setShowModal(true);
      return false;
    }

    if (!formData.deadline || formData.deadline === "") {
      setModalMessage("Please select a deadline.");
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setModalMessage("You must be logged in to assign a task.");
      setShowModal(true);
      return;
    }

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    const task = {
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      status: "pending",
      assignedOn: new Date().toLocaleDateString(),
      deadline: formData.deadline,
    };

    try {
      await addDoc(collection(db, "task"), task);
      setModalMessage("Task assigned successfully!");
      setShowModal(true);

      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Low",
        agreement: false,
        deadline: "",
      });

      setTimeout(() => {
        setShowModal(false);
        navigate("/admindashboard");
      }, 2000);
    } catch (error) {
      setModalMessage("Error assigning task. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-r from-yellow-50 to-purple-100 p-8 min-h-screen overflow-hidden">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Assign Task
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-2xl max-w-3xl mx-auto space-y-6"
      >
        <fieldset className="space-y-4">
          <legend className="font-semibold text-xl text-gray-700 mb-4">
            Task Details
          </legend>
          <label className="block text-gray-700">
            Task Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block text-gray-700">
            Description of Task:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block text-gray-700">
            Assigned To:
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Faculty</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} {/* Displaying the full name */}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-gray-700">
            Priority:
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          {/* New deadline field */}
          <label className="block text-gray-700">
            Deadline:
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-dark-blue-600 text-white rounded-lg hover:bg-dark-blue-600 focus:outline-none focus:ring-2 focus:ring-dark-blue-600"
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      </form>

      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
    </main>
  );
};

export default AssignTask;
