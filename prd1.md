# Cahier des Charges — Web Application **DigiMenu**

---

## 1. General Project Overview

DigiMenu is a full stack web application designed to help restaurants present their menu digitally through a modern, responsive, and easy-to-use interface.

The application allows customers to browse the restaurant menu from a web page, usually accessed through a QR code or direct link.

DigiMenu must provide a simple and reliable solution to:

* Display restaurant information
* Organize menu items by categories
* Present products clearly with prices and descriptions
* Allow basic administration of categories and products
* Store menu data in a MySQL database

The MVP focuses only on the essential features needed to build a functional digital menu system.

---

## 2. Current Problems and Challenges

Many restaurants still manage their menus using:

* Paper menus
* Static images
* PDF files
* Social media posts
* Manual updates without structure

These methods can create several problems:

* Difficulty updating products and prices
* Poor customer experience on mobile devices
* Lack of clear organization by category
* No centralized database for menu data
* Time wasted when menu information changes
* Risk of showing outdated products or prices

DigiMenu aims to solve these problems by centralizing menu data and displaying it through a clean web interface.

---

## 3. Functional Objectives

The application must allow:

* Customers to view the restaurant menu
* Customers to filter products by category
* Customers to view product details
* Administrators to manage categories
* Administrators to manage products
* The backend to expose a REST API
* The frontend to consume the API using Axios
* The database to store products and categories correctly

The objective of the MVP is not to build a complete restaurant management system, but to create a clean and functional digital menu application.

---

## 4. Project Scope

### Included in the MVP

The MVP includes:

* Complete frontend with React
* Styling with Tailwind CSS
* Backend API with Laravel
* MySQL database
* phpMyAdmin for database management
* CRUD categories
* CRUD products
* Public menu page
* Admin pages for managing products and categories
* API testing using Insomnia
* Git and GitHub version control

---

### Excluded from the MVP

The following features are not included in the MVP:

* Authentication
* User roles
* Online ordering
* Payment system
* Delivery management
* Table reservation
* QR code generation
* Multi-restaurant support
* Image upload
* Analytics dashboard
* Notifications
* Advanced search
* Reviews and ratings

These features can be added later after the MVP is completed and tested.

---

## 5. Technical Constraints

### 5.1 Application Architecture

The application must follow a distributed architecture:

* Frontend: React client application
* Backend: Laravel REST API
* Database: MySQL
* Data exchange format: JSON

The frontend and backend must be separated into two folders:

```text
digimenu/
├── frontend/
└── backend/
```

---

### 5.2 Required Technologies

#### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

#### Backend

* PHP
* Laravel
* Laravel API Routes
* Laravel Controllers
* Laravel Models
* Laravel Migrations
* Laravel Form Requests

#### Database

* MySQL
* phpMyAdmin

#### API Testing

* Insomnia

#### Version Control

* Git
* GitHub

---

## 6. Data Organization

The MVP data model is based on two main entities:

* Category
* Product

The detailed database structure must respect the existing UML class diagram.

### Conceptual Relationship

* One category can have many products
* One product belongs to one category

---

## 7. Expected Deliverables

### 7.1 Analysis Documentation

The project should include:

* Use case diagram
* Class diagram
* User stories
* Simple sprint plan

The class diagram has already been prepared and should be respected during development.

---

### 7.2 Technical Documentation

The project should include:

* Database structure
* API documentation
* Installation instructions
* Basic project architecture explanation
* Insomnia API test collection if possible

---

### 7.3 Software Deliverables

The final MVP must include:

* Functional React frontend
* Functional Laravel backend
* MySQL database with migrations
* REST API endpoints
* Code pushed to GitHub
* Clear project structure
* Working local installation

---

## 8. MVP — Minimum Viable Product

The MVP must contain only the essential features required for a digital menu.

### Public Customer Side

The customer can:

* View restaurant information
* View categories
* View products
* Filter products by category
* View product details

---

### Admin Side

The administrator can:

* List categories
* Add a category
* Edit a category
* Delete a category
* List products
* Add a product
* Edit a product
* Delete a product

Authentication is not included in this MVP.
The admin pages are only used locally for project learning and testing.

---

### Backend API

The Laravel backend must provide REST API endpoints for:

* Categories
* Products

The API must support:

* Create
* Read
* Update
* Delete
* Basic validation
* Basic error handling

---

## 9. Functional Requirements

### 9.1 Restaurant Information

The application must display:

* Restaurant name
* Description
* Logo or image URL
* Phone number
* Address

For the MVP, restaurant information may be static or stored in a simple configuration/data file.

---

### 9.2 Categories

A category represents a menu section.

Examples:

* Pizza
* Burgers
* Drinks
* Desserts

Category fields:

* id
* name
* description
* created_at
* updated_at

Required operations:

* Create category
* Read categories
* Update category
* Delete category

---

### 9.3 Products

A product represents an item in the restaurant menu.

Product fields:

* id
* category_id
* name
* description
* price
* image_url
* is_available
* created_at
* updated_at

Required operations:

* Create product
* Read products
* Read products by category
* Update product
* Delete product

---

## 10. API Endpoints

Base URL:

```text
/api
```

### Categories

```text
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

### Products

```text
GET    /api/products
GET    /api/products/{id}
GET    /api/categories/{id}/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

---

## 11. Database Structure

### categories

| Field       | Type      | Description                   |
| ----------- | --------- | ----------------------------- |
| id          | BIGINT    | Primary key                   |
| name        | VARCHAR   | Category name                 |
| description | TEXT      | Optional category description |
| created_at  | TIMESTAMP | Creation date                 |
| updated_at  | TIMESTAMP | Update date                   |

---

### products

| Field        | Type      | Description               |
| ------------ | --------- | ------------------------- |
| id           | BIGINT    | Primary key               |
| category_id  | BIGINT    | Foreign key to categories |
| name         | VARCHAR   | Product name              |
| description  | TEXT      | Product description       |
| price        | DECIMAL   | Product price             |
| image_url    | VARCHAR   | Product image URL         |
| is_available | BOOLEAN   | Product availability      |
| created_at   | TIMESTAMP | Creation date             |
| updated_at   | TIMESTAMP | Update date               |

---

## 12. Frontend Pages

### Public Pages

#### Menu Page

The menu page must display:

* Restaurant information
* Category list
* Product list
* Product cards

#### Product Details

The product details view must display:

* Product image
* Product name
* Product description
* Price
* Availability
* Category

---

### Admin Pages

#### Categories Management Page

This page must allow:

* Listing categories
* Creating categories
* Editing categories
* Deleting categories

#### Products Management Page

This page must allow:

* Listing products
* Creating products
* Editing products
* Deleting products

---

## 13. User Interface Requirements

The interface must be:

* Simple
* Clean
* Responsive
* Mobile-first
* Easy to navigate

Tailwind CSS must be used for styling.

The design must focus on usability, not advanced animations.

---

## 14. Validation Rules

### Category Validation

* name is required
* name must be unique
* description is optional

### Product Validation

* name is required
* category_id is required
* category_id must exist in categories table
* price is required
* price must be numeric
* image_url is optional
* description is optional
* is_available is boolean

---

## 15. API Testing

All API endpoints must be tested with Insomnia.

Required API tests:

* Create category
* List categories
* Show category
* Update category
* Delete category
* Create product
* List products
* Show product
* Update product
* Delete product
* List products by category

---

## 16. Evaluation Criteria

### Technical Criteria

The MVP will be considered successful if:

* The Laravel API works correctly
* The React frontend communicates with the API
* MySQL database relations are correct
* CRUD categories works
* CRUD products works
* API validation is implemented
* The UI is responsive
* The code is clean and organized
* The project is versioned with Git

---

### Possible Future Improvements

Future versions may include:

* Authentication
* Admin roles
* QR code generation
* Image upload
* Multi-restaurant support
* Dashboard statistics
* Online ordering
* Payment system
* Advanced search
* Export PDF

These features must not be developed before the MVP is complete.

---

## 17. Work Before Coding

Before coding, the following elements should be prepared:

* User stories
* Use case diagram
* Class diagram
* Simple wireframes
* Small task plan

The code should start only after the project scope and MVP are clear.

---

## 18. Development Rules

The development must follow these rules:

* Build only the MVP first
* Do not add unnecessary features
* Keep the code simple and readable
* Use Laravel conventions
* Use React reusable components
* Use Tailwind utility classes
* Use Axios for API communication
* Test the API with Insomnia
* Make small and clear Git commits

Example commit messages:

```text
Create Laravel API structure
Create categories migration and model
Add categories API endpoints
Create products migration and model
Add products API endpoints
Create React menu page
Connect products API with frontend
Add admin category management
Add admin product management
```

---

## 19. Notes for AI Coding Agents

Current project phase: MVP development.

The AI coding agent must:

* Respect the MVP scope
* Use React and Tailwind CSS for frontend
* Use Laravel as a REST API backend
* Use MySQL as database
* Follow the existing UML class diagram
* Avoid authentication in the MVP
* Avoid online ordering
* Avoid payments
* Avoid QR code generation
* Avoid image upload
* Avoid overengineering
* Keep the implementation beginner-friendly

Development priority:

1. Database migrations
2. Laravel models and relationships
3. Laravel API controllers
4. API validation
5. API testing with Insomnia
6. React frontend pages
7. Axios API integration
8. Responsive UI
