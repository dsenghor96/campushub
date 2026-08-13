# CampusHub

## Installation
### Prérequis
- JDK 17+
- Node 20+
- Docker

### Lancer en local
```bash
docker compose up
```
Application disponible sur http://localhost:4200  
Swagger UI sur http://localhost:8080/swagger-ui.html

## Architecture
Le projet CampusHub est structuré autour d'un backend Spring Boot modulaire exposant une API REST sécurisée, adossé à une base de données PostgreSQL, et consommé par une application frontend Angular. Le tout est conteneurisé via Docker.

## Modules

- **Étudiants** (G2) — CRUD complet (`/api/etudiants`) avec pagination, tri, et validation stricte des DTOs (`@NotBlank`, `@Email`, etc.). La lecture est accessible à tous, tandis que l'écriture est réservée au rôle administrateur. Le module est packagé via son propre Dockerfile.
- **Cours & Inscriptions** (G3) — Gestion des cours et des inscriptions (relation *many-to-many*). Implémentation basée sur une architecture 3 couches, traitements analytiques via l'API Stream de Java (moyenne d'âge, statistiques), et documentation Swagger. La sécurisation des routes d'écriture est assurée par JWT.
- **Persistance** (G4) — Stockage relationnel PostgreSQL articulé sur 4 tables principales (étudiants, cours, inscriptions avec attributs, et utilisateurs). L'évolution du schéma est versionnée et automatisée par Flyway (migrations V1 à V8), assurant la fiabilité des déploiements. Le modèle de données est documenté dans `docs/schema.md`.
- **Sécurité** (G5) — Authentification centralisée par JWT (via `jjwt`) et hachage de mots de passe par BCrypt. Le contrôle d'accès s'effectue par rôle (ADMIN / ETUDIANT) via `@PreAuthorize`. Les réponses d'erreur sont normalisées (401/403) et l'ensemble est couvert par des tests d'intégration sécurisés.
- **Frontend Core** (G6) — Conception du socle réactif Angular (Signals, composants standalone) et intégration HTTP des données paginées avec gestion complète des états (chargement, erreur, succès). Sécurisation de l'interface par rôles (RBAC), validation par tests unitaires (Vitest), et livraison d'un Dockerfile multi-stage optimisé sous Nginx avec routing SPA.
- **Frontend Formulaires & Auth** (G7) — Implémentation du parcours utilisateur : routing applicatif, formulaires réactifs pour l'administration (avec validation client/serveur), et gestion de l'état (Signals). L'authentification est gérée via un `AuthService`, avec un intercepteur HTTP pour l'injection du token et des *guards* pour protéger les vues.
- **CI/CD & Déploiement** (G8) — Mise en place et automatisation du pipeline CI/CD avec GitHub Actions (build et tests du backend et du frontend). Gestion de la conteneurisation Docker, configuration du déploiement continu, et sécurisation des variables d'environnement pour assurer la fiabilité de l'application en production.

## Lien Swagger en production
*https://campushub-web.onrender.com/swagger-ui/index.html*

## Déploiement
*https://campushub-web.onrender.com/actuator/health*
