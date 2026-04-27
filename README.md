# 🚀 Serverless Contact Form using AWS

A fully serverless contact form application built using AWS services. This project demonstrates how to design and deploy a scalable backend without managing servers.

---

## 📌 Project Overview

This application allows users to submit contact form details through a web interface. The data is processed and stored using serverless AWS services.

---

## 🧱 Architecture

User → S3 → API Gateway → Lambda → DynamoDB

---

## ⚙️ Features

- Serverless backend using AWS Lambda
- API handling with API Gateway
- Data storage using DynamoDB
- Static website hosting using S3
- CI/CD using GitHub Actions
- Ticket ID generation for each request

---

## 🛠️ Tech Stack

- HTML, CSS, JavaScript (Frontend)
- Python (Backend)
- AWS Lambda
- API Gateway
- DynamoDB
- S3
- GitHub Actions (CI/CD)

---

## 📁 Project Structure
serverless-contact-form/
│
├── frontend/
│   ├── index.html
│
├── backend/
│   ├── lambda_function.py
│   ├── requirements.txt
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── README.md
