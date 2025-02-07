# Faculty Task Management Portal
This project is a web application for managing tasks assigned to faculty members within a college. It allows administrators to log in, assign tasks to faculty, and manage them through a user-friendly interface.

## Table of Contents
- Features
- Technologies Used
- Installation
- Usage
- Project Structure
- Contributing
- License

## Features
- User authentication (login and signup)
- Role-based access (Faculty and Admin)
- Assign tasks to faculty members
- View and manage assigned tasks
- Responsive design for mobile and desktop
- Real-time updates using Firebase

## Technologies Used
- React
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Router
- React Swipeable
- Chart.js
- React Toastify

## Installation
### Clone the repository:
```sh
git clone https://github.com/your-username/faculty-task-management-portal.git
cd faculty-task-management-portal
```

### Install dependencies:
```sh
npm install
```

### Create a `.env` file in the root directory and add your Firebase configuration:
```sh
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Start the development server:
```sh
npm start
```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Sign up as a new user or log in with existing credentials.
3. Depending on your role (Faculty or Admin), you will be redirected to the appropriate dashboard.
4. Admins can assign tasks to faculty members, view all tasks, provide feedback, and update their status.
5. Faculty members can view their assigned tasks, mark them as completed, and view feedback from admins.

## Project Structure
```
.
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── AdminDashboard.js
│   │   ├── AssignTask.js
│   │   ├── FacultyDashboard.js
│   │   ├── Login.js
│   │   └── SignUp.js
│   ├── media/
│   │   └── (images and media files)
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── firebase.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env
├── .firebaserc
├── .gitignore
├── firebase.json
├── package.json
├── README.md
└── tailwind.config.js
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

