# Affiliate++

Affiliate++ is a full-stack SaaS platform that enables affiliate marketers to manage, shorten, categorize, and track affiliate links — all in one place. It includes secure authentication, real-time analytics, and payment integration for subscription-based access.

## 🚀 Features

- 🔗 Create and manage shortened affiliate links
- 📊 Real-time click tracking with analytics
- 👥 Role-based access (parent/child accounts)
- 🔒 Secure JWT-based authentication (stateless, cookie-managed)
- 🔐 Google Single Sign-On (SSO) integration
- 💳 Razorpay integration with webhook-based payment flow
- 📁 Link categorization and management dashboard
- 📱 Mobile-responsive UI
- ⚙️ RESTful APIs with middleware for validation & access control

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS (if used)
- Google SSO

### Backend
- Node.js (Express)
- MongoDB
- JWT (for authentication)
- Razorpay SDK + Webhooks
- REST APIs

## 📁 Project Structure

Affiliate/
│
├── Affiliate-Link-Share-Client-main/ # Frontend (React)
│ └── ... # Components, pages, etc.
│
├── Affiliate-Link-Share-Server-main/ # Backend (Node.js + Express)
│ └── ... # Routes, models, controllers, middleware
│
└── README.md


## 🔐 Authentication

- Users can log in using:
  - Standard credentials (JWT-based)
  - Google SSO for one-click authentication
- Role-based access for managing sub-users (e.g., child accounts under a parent)

## 💸 Payments

- Integrated Razorpay for subscription models
- Webhook-based event handling for successful/failed transactions
- Credit system support

## 📦 Setup Instructions

### 1. Clone the Repository


```bash
git clone https://github.com/ankush-singh2005/Affiliate.git
cd Affiliate
2. Frontend Setup
cd Affiliate-Link-Share-Client-main
npm install
npm start
3. Backend Setup
cd Affiliate-Link-Share-Server-main
npm install
npm run dev
⚠️ Make sure to configure .env files for both frontend and backend.

🧪 Testing
Unit and integration testing coming soon.

📄 License
This project is licensed under the MIT License.

🙋‍♂️ Author
Ankush Singh