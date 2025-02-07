
# College Complaints and Suggestions Portal

This project is a web application for managing complaints and suggestions within a college. It allows students and administrators to log in, submit complaints or suggestions, and manage them through a user-friendly interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (login and signup)
- Role-based access (Student and Admin)
- Submit complaints and suggestions
- View and manage complaints and suggestions
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

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/college-complaints-portal.git
   cd college-complaints-portal
   ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

    ```sh
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    ```

4. Start the development server:

    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Sign up as a new user or log in with existing credentials.
3. Depending on your role (Student or Admin), you will be redirected to the appropriate dashboard.
4. Students can submit complaints and suggestions, view their submissions, and track their status.
5. Admins can view all complaints and suggestions, provide feedback, and update their status.

## Deployed Website

The application is already deployed. You can find the live version of the website through the About section of this repository.

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
│   │   ├── Login.js
│   │   ├── MakeComplaint.js
│   │   ├── MakeSuggestion.js
│   │   ├── SignUp.js
│   │   └── StudentDashboard.js
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
