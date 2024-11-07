# 🧑‍💼 User Service

The **User Service** is a core component of the NestCart e-commerce platform, responsible for managing user-related functionalities, including authentication, profile management, address management, and user role handling.

## ✨ Features

1. **User Authentication** 🔐:
   - 📝 Registration
   - 🔑 Login (with banned user restriction)
   - 🌐 Google Sign-up
   - 🔄 Password reset (OTP-based)
   - 🔄 Change password

2. **User Profile Management** 🧾:
   - 👤 View profile
   - ✏️ Update profile
   - 📸 Update profile picture

3. **Address Management** 📍:
   - ➕ Create, update, and delete addresses
   - 📄 Retrieve all addresses for a user

4. **Admin Features** 👨‍💼:
   - 🔍 Retrieve all customers
   - 🚫 Ban or unban customers

---

## ⚙️ Prerequisites

1. **NestJS** 📘 - [NestJS Documentation](https://docs.nestjs.com/)
2. **Database** 🛢️ - PostgreSQL (configured with TypeORM)
3. **Swagger** 📝 - API documentation
4. **JWT Authentication** 🔐 - Secure endpoints

---

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/safkatms/NestCart.git
   cd NestCart/user-service
