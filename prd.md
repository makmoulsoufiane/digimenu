# DigiMenu - Product Requirements Document (PRD)

## 1. Project Overview

DigiMenu is a web application designed to help restaurants manage digital menus and, in future versions, manage customer visits, orders, waiters, and reviews.

The project will be developed progressively, starting with a simple MVP focused on menu management.

---

## 2. Business Vision

A customer sits at a restaurant table and scans a QR code.

The customer can browse the menu, view products, and later place orders through the system.

Orders are associated with a customer visit and can be managed by waiters.

The long-term goal is to digitize the restaurant customer journey from menu consultation to order tracking and customer reviews.

---

## 3. Main Business Flow

```text
Manager
    ↓
Menu
    ↓
Menu Items

Customer
    ↓
Visit
    ↓
Restaurant Table

Visit
    ↓
Order
    ↓
Order Items

Waiter
    ↓
Accept / Manage Order

Visit
    ↓
Review
```

---

## 4. MVP Scope

Only the following modules must be implemented.

### Menu Management

* Create Menu
* Update Menu
* Delete Menu
* List Menus

### Menu Item Management

* Create Menu Item
* Update Menu Item
* Delete Menu Item
* List Menu Items
* Filter Items by Menu
* Manage Product Availability

### Public Interface

* View Menus
* View Menu Items
* View Product Details

### Administration Interface

* Manage Menus
* Manage Menu Items

### REST API

* CRUD Menu
* CRUD Menu Items

---

## 5. Out of Scope (Future Versions)

The following modules are not part of the MVP:

* Authentication
* Manager Management
* Waiter Management
* Restaurant Tables
* Customer Management
* Visits
* Orders
* Reviews
* QR Code Generation
* Notifications
* Statistics
* Payments
* Dashboard

---

## 6. Technologies

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Laravel
* REST API
* Controllers
* Models
* Form Requests
* Migrations

### Database

* MySQL

### Tools

* Git
* GitHub
* VS Code
* Postman / Insomnia

---

## 7. Database Vision

The complete system is designed around the following entities:

* Manager
* Menu
* Menu_items
* Waiter
* RestaurantTable
* Customer
* Visit
* Order
* Order_items
* Review

Important:

Only the following entities are required for the MVP:

* Menu
* Menu_items

All other entities belong to future versions.

---

## 8. Future Business Logic

### Restaurant Table

A restaurant table can receive multiple visits over time.

### Customer

A customer can have multiple visits.

### Visit

A visit represents a customer's session at a restaurant table.

A visit starts when the customer occupies a table and ends when the customer leaves.

### Order

An order belongs to a visit.

A visit can contain multiple orders.

### Order Items

An order contains one or more products.

The original product price must be stored in the order item.

### Waiter

A waiter may accept and manage customer orders.

### Review

A visit can receive a customer review after completion.

---

## 9. MVP Success Criteria

The MVP is considered complete when:

* Menus can be created, updated, deleted, and listed.
* Menu items can be created, updated, deleted, and listed.
* Menu items can be filtered by menu.
* Public users can browse menus and products.
* Administrators can manage menus and products.
* The API works correctly.
* Data validation is implemented.
* Source code is managed with Git.

---

## 10. Development Strategy

### Version 1 (MVP)

* Menu
* Menu Items
* Public Menu Interface
* Administration Interface
* REST API

### Version 2

* Authentication
* Manager Module

### Version 3

* Restaurant Tables
* Customer
* Visit

### Version 4

* Order
* Order Items

### Version 5

* Waiter Management

### Version 6

* Reviews

---

## 11. Instructions for AI Coding Assistants

* Read this document before coding.
* Develop only the requested version.
* Respect the MVP scope.
* Do not implement future modules before validation.
* Follow Laravel conventions.
* Use reusable React components.
* Keep the architecture simple.
* Avoid overengineering.
* Create database migrations before developing the UI.
