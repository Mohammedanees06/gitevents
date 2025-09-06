GitHub Timeline Notifier

Description:
This project is a simple web application that fetches recent GitHub events from the public GitHub API and sends a summary to users via email. Only registered and logged-in users receive these updates. The app uses Node.js and Express for the backend, MongoDB for user authentication, and Nodemailer to send emails. On the frontend, users can signup, login, and receive notifications that their GitHub timeline has been sent to their email.

Key Features:

User signup and login 

Fetch latest GitHub events using Axios.

Automatically email GitHub activity to logged-in users.

Simple React frontend displaying login/signup forms and dashboard messages.

Secure storage of credentials using environment variables.

Tech Stack:

Frontend: React, React Router

Backend: Node.js, Express

Database: MongoDB

Email: Nodemailer

API: GitHub Events API
