  # Cahier des Charges — Application Web DigiMenu

  ---

  # 1. Présentation Générale du Projet

  DigiMenu est une application web permettant la gestion numérique d’un restaurant.

  L’objectif est de remplacer les méthodes traditionnelles de gestion des menus et, à terme, permettre la gestion complète des opérations du restaurant.

  L’application devra permettre :

  * La consultation des menus numériques
  * La gestion des produits du menu
  * La gestion des serveurs
  * La gestion des tables
  * Le suivi des visites clients
  * La gestion des commandes
  * Le suivi des avis clients

  Le système doit être évolutif afin de permettre l’ajout progressif de nouveaux modules.

  ---

  # 2. Enjeux et Problèmes Actuels

  Les restaurants utilisent souvent :

  * Menus papier
  * Fichiers PDF
  * Réseaux sociaux
  * Gestion manuelle des commandes

  Ces méthodes entraînent :

  * Difficulté de mise à jour des menus
  * Informations obsolètes
  * Mauvaise expérience client
  * Perte de données
  * Difficulté de suivi des commandes

  DigiMenu vise à centraliser ces informations dans une seule plateforme moderne.

  ---

  # 3. Objectifs Fonctionnels

  L’application devra permettre :

  ### Gestion du Menu

  * Création des menus
  * Gestion des produits
  * Disponibilité des produits

  ### Gestion du Personnel

  * Gestion des managers
  * Gestion des serveurs

  ### Gestion du Restaurant

  * Gestion des tables
  * Gestion des visites clients

  ### Gestion des Commandes

  * Création des commandes
  * Gestion des produits commandés
  * Suivi du statut des commandes

  ### Gestion de la Satisfaction Client

  * Avis
  * Notes
  * Commentaires

  ---

  # 4. Périmètre du Projet

  ## Inclus dans le projet global

  * Frontend React
  * Backend Laravel
  * API REST
  * Base de données MySQL
  * Authentification
  * Gestion des rôles
  * Gestion du menu
  * Gestion des commandes
  * Gestion des tables
  * Gestion des avis
  * Tableau de bord administratif

  ---

  # 5. Contraintes Techniques

  ## Architecture

  * Frontend React
  * Backend Laravel REST API
  * Base de données MySQL
  * Communication JSON

  Structure :

  ```text
  digimenu/
  ├── frontend/
  ├── backend/
  ├── PRD.md
  └── README.md
  ```

  ## Technologies

  ### Frontend

  * React
  * Vite
  * Tailwind CSS
  * React Router
  * Axios

  ### Backend

  * Laravel
  * Controllers
  * Models
  * Form Requests
  * Migrations

  ### Base de données

  * MySQL
  * phpMyAdmin

  ### Outils

  * Git
  * GitHub
  * Insomnia

  ---

  # 6. Structure Organisationnelle des Données

  La structure complète est définie par le diagramme UML.

  Le système contient les entités suivantes :

  * Manager
  * Menu
  * Menu_items
  * Waiter
  * Table
  * Customer
  * Visit
  * Order
  * Order_items
  * Review

  Les cardinalités et relations doivent respecter le diagramme UML officiel.

  ---

  # 7. Livrables Attendus

  ## Documentation d’Analyse

  * User Stories
  * Diagramme de Cas d’Utilisation
  * Diagramme de Classes
  * Wireframes

  ## Documentation Technique

  * Documentation API
  * Architecture du projet
  * Structure de la base de données
  * Instructions d’installation

  ## Livrables Logiciels

  * Frontend React
  * Backend Laravel
  * Base de données MySQL
  * Code source GitHub

  ---

  # 8. MVP — Version Minimale Requise

  Le MVP doit uniquement contenir :

  ## Menu

  * Ajouter un menu
  * Modifier un menu
  * Supprimer un menu
  * Lister les menus

  ## Menu Items

  * Ajouter un produit
  * Modifier un produit
  * Supprimer un produit
  * Lister les produits
  * Filtrer les produits par menu

  ## Interface Publique

  * Consultation du menu
  * Affichage des produits
  * Détail d’un produit

  ## Interface Administration

  * Gestion des menus
  * Gestion des produits

  ## API REST

  * CRUD Menu
  * CRUD Menu_items

  Aucun autre module ne doit être développé avant validation du MVP.

  ---

  # 9. Modules Futurs (Hors MVP)

  ## Module Manager

  * Authentification
  * Gestion des managers

  ## Module Waiter

  * Gestion des serveurs

  ## Module Table

  * Gestion des tables

  ## Module Customer

  * Gestion des clients

  ## Module Visit

  * Historique des visites

  ## Module Order

  * Création des commandes
  * Suivi des commandes

  ## Module Review

  * Avis et notes clients

  ---

  # 10. Critères d’Évaluation

  ## Critères Techniques

  * Respect du MVP
  * Fonctionnement de l’API
  * Respect des relations UML
  * Code propre et organisé
  * Interface responsive
  * Validation des données
  * Utilisation correcte de Git

  ## Bonus

  * Authentification
  * Dashboard
  * QR Code
  * Upload d’images
  * Statistiques
  * Export PDF

  Les bonus ne doivent être réalisés qu’après validation du MVP.

  ---

  # 11. Développement Progressif

  Le projet doit être réalisé par étapes.

  ## Version 1

  * Menu
  * Menu_items
  * Interface publique
  * CRUD

  ## Version 2

  * Manager
  * Authentification

  ## Version 3

  * Waiter
  * Table
  * Customer
  * Visit

  ## Version 4

  * Order
  * Order_items

  ## Version 5

  * Review

  ---

  # 12. Instructions pour les Agents IA

  L’agent IA doit :

  * Lire ce document avant de coder
  * Respecter le diagramme UML
  * Respecter le périmètre MVP
  * Ne pas implémenter tous les modules simultanément
  * Développer uniquement la version demandée
  * Utiliser les conventions Laravel
  * Utiliser des composants React réutilisables
  * Éviter le sur-développement (overengineering)

  Important :

  Le diagramme UML représente la vision complète du projet.

  Le MVP ne concerne que :

  * Menu
  * Menu_items
  * API REST
  * Interface publique
  * Interface d’administration

  Tous les autres modules sont réservés aux versions futures.
