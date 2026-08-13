### Journal — Jour 3
- *Appris*

1. *Flyway applique les migrations SQL au démarrage de Spring Boot automatiquement*
2. *Sans spring-boot-starter-jdbc, Flyway ne peut pas se connecter à la base*
3. *docker exec permet de vérifier les tables directement dans le conteneur*

- *Bloqué*
Le pull origin main écrasait des fichiers non commités dans target/

- *Question*
Quelle stratégie adopter si deux groupes modifient le même fichier SQL ?

### Jour 3 - G8 (Dieynaba)
- *Appris* : Configuration d'un vrai pipeline CI GitHub Actions avec Maven (`setup-java`) et création d'une documentation pour préparer l'environnement Cloud de production. J'ai aussi appris à synchroniser proprement mon fork (`git fetch upstream`).
- *Bloqué* : Mon pipeline a échoué car Maven ne trouvait pas le `pom.xml`. J'ai compris que le robot s'ouvrait à la racine du dépôt, j'ai débloqué ça en ajoutant `cd campushub` dans le script `build.yml`.
- *Question* : Pour le G4, confirmez-vous bien que nous utiliserons la base PostgreSQL managée intégrée à Render pour la production ?

### Jour 3 - G6 (Fatou Cissé Ndong, Ibrahima Sow)
- *Pour ce qu'on a appris* : On a rècupérer des données á partir d'une API, faire de l'injection de dépendances, s'abonner à une API
- *Problèmes rencontrés*: Il nous fallait attendre G2 pour qu'il termine leur tâche ce qui nous a retardé. Il y'a aussi le fait que les codes fournis ne suivent pas la structure des nouvelles versions d'angular avec lesquelles nous travaillons ce qui a fait qu'on a du les modifer.
- *Questions*: Comment faire pour la prochaine fois, garder les codes fournis ou l'adapter avec notre version ?

### Jour 5 (G4 - Khadija Dieng, Mohamed Aminou Niang)
- *Ce qu'on a fait*
- Créé et testé `V3__utilisateur.sql` (table utilisateur pour JWT)
- Créé `V4__utilisateur_ajustements.sql` suite à un décalage détecté avec l'entité `Utilisateur.java` de G5 (champ `nom` manquant)
- Vérifié que V1→V4 s'appliquent proprement sur une base fraîche
- Mis à jour `/schema.md` avec le diagramme incluant `utilisateur`

### Note pour G5 : Vérification entité Utilisateur
En comparant votre entité `Utilisateur.java` avec la table créée en V3, on a remarqué deux points :
1. **Champ `nom` manquant en base**
   Votre entité déclare `private String nom;`, mais la migration V3
   ne contenait que `email`, `mot_de_passe_hash`, `role`, pas de colonne `nom`.
   Donc on a créé `V4__utilisateur_ajustements.sql` qui ajoute uniquement `nom`.

2. **Mapping de colonne à corriger**
   Votre champ `motDePasse` va par défaut chercher une colonne `mot_de_passe`, mais la table a `mot_de_passe_hash`.
   Il faut ajouter :
```java
   @Column(name = "mot_de_passe_hash", nullable = false)
   private String motDePasse;
```

# Journal — Jour 6

## Appris
- Une migration Flyway doit respecter exactement le schéma SQL existant
- Les colonnes dans V5 doivent correspondre aux colonnes réelles après V1+V2
- Le schéma de cours n'a pas de credits ni d'intitule mais code et nom

## Bloqué
- Le pom.xml avait des doublons JWT (0.12.5 et 0.12.6) qui ont causé des conflits
- Un camarade a finalement corrigé le problème cote main

## Question
- Comment eviter que plusieurs personnes modifient le meme fichier pom en parallele ?

### Jour 8 - G4
- Comptes de test ADMIN/ETUDIANT introuvables en base ce matin (aucune migration ne les créait).
- Recréés manuellement via `/api/auth/register` + `UPDATE role='ADMIN'` en SQL pour débloquer les tests de G7.
- Solution temporaire, valable uniquement en local : recommandation d'ajouter une vraie migration versionnée (ex: V7) si besoin que ce soit reproductible pour toute l'équipe.



### Jour 9 - G4

## Appris
- Le healthcheck depends_on condition: service_healthy garantit que le backend attend vraiment que PostgreSQL soit prêt avant de démarrer, pas juste que le conteneur soit lancé
- docker compose up --build reconstruit les images depuis zéro et évite les comportements inattendus dus aux caches
- docker system prune nettoie les images et volumes orphelins avant un test propre
- Le nginx.conf doit avoir try_files pour que le routing Angular (SPA) fonctionne correctement côté frontend

### Jour 10 - G2 (Bilan final, 2 semaines)

## Appris
- Construire une API REST couche par couche (contrôleur / service / repository) en partant du stockage en mémoire jusqu'à la persistance JPA/PostgreSQL, sans tout casser à chaque étape
- Documenter au fur et à mesure dans Swagger plutôt qu'à la fin évite d'accumuler une dette de documentation
- Sécuriser une API par rôle avec `@PreAuthorize` reste simple tant que le contrat des DTO est figé tôt (notre `EtudiantRequest` n'a quasiment pas bougé depuis le jour 3)
- Un Dockerfile multi-stage (Maven → JRE Alpine) réduit fortement la taille de l'image finale, et le chemin exact du Dockerfile (`docker/backend/` vs `docker/back/`) compte autant que son contenu quand plusieurs groupes doivent s'y référencer

## Ce qui a bien fonctionné dans la collaboration à 8 groupes
- Le format `ErreurResponse` défini par G1 dès le jour 3 a été réutilisé tel quel jusqu'au jour 8 par G7 côté frontend, sans aucune divergence à corriger
- Les points de dépendance explicitement annoncés dans les fiches de tâches quotidiennes (CORS pour G6, contrat Swagger pour G7, JWT de G5) ont évité la plupart des blocages surprises
- La redistribution du périmètre de G8 au jour 9 (Docker/CI répartis sur les 7 groupes restants) s'est faite sans réel retard grâce au séquencement clair (matin : Dockerfiles en parallèle, après-midi : intégration par G4 puis G1)

## Ce qui pourrait être amélioré pour une prochaine session
- Certains noms de dossiers (`docker/backend` vs `docker/back`) étaient ambigus entre la fiche de tâches et l'existant du repo — un nommage figé dès le départ aurait évité une clarification de dernière minute
- Le pipeline CI n'a eu de service PostgreSQL qu'au jour 9 ; des tests d'intégration (`@ActiveProfiles("test")`) existaient avant sans pouvoir tourner en CI jusque-là
- Prévoir un canal dédié aux annonces de changement de contrat (DTO, format d'erreur) aurait fluidifié la coordination inter-groupes plutôt que de compter sur le stand-up du matin


## Bilan du groupe G6 (Frontend Core)

### Ce que nous avons appris sur les 2 semaines

- **Collaboration et synergie d'équipe :** Expérimenter la réalité du travail en équipe à grande échelle (8 groupes interdépendants), où la réussite collective prime sur la performance individuelle. Nous avons compris l'importance de l'écoute, de la synchronisation et de la co-construction pour faire avancer un projet.
  
- **Maîtrise d'Angular moderne :** Implication approfondie sur l'architecture standalone, l'utilisation des signaux (`signal`, `input`, `output`) et les nouvelles structures de contrôle (`@if`, `@for`).
  
- **Gestion d'état et des flux asynchrones :** Connexion robuste d'une interface réactive aux API REST (via `HttpClient`), gestion fine des 3 états (chargement, erreur, succès) et mise en place d'une pagination synchrone avec le backend.
  
- **Sécurité et rôles front-end :** Implémentation d'une adaptation dynamique de l'interface selon le profil utilisateur (visiteur, étudiant, administrateur) en s'appuyant sur un service d'authentification centralisé.
  
- **Containerisation et Déploiement :** Conception d'un Dockerfile multi-stage optimisé pour une application Angular et configuration d'un serveur Nginx pour la gestion du routing côté client (SPA).
  

### Ce qui a bien fonctionné dans la collaboration à 8 groupes

- **Complémentarité inter-équipes :** Une excellente synergie avec les autres groupes (intégration fluide avec l'API de G2, utilisation du service d'auth de G7, intégration du Dockerfile par G4 et revues de cohérence croisées avec G1).
  
- **Communication et alignement :** Le respect des contrats d'interfaces et des rôles de chacun a permis d'avancer de manière incrémentale et sans blocage majeur.
  

### Ce qui pourrait être amélioré pour une prochaine session

- **Gestion des imprévus et des groupes inactifs :** Prévoir une stratégie ou un plan de secours clair (réassignation rapide des tâches) en cas d'indisponibilité d'un groupe pour éviter l'accumulation de travail en fin de parcours.
  
- **Gouvernance des fichiers transverses et sensibles :** Établir une règle stricte de communication avant toute modification de fichiers structurants ou partagés (ex: configuration de build, gestion de base de données/migrations) afin d'éviter des conflits bloquants pour les autres équipes.
  
- **Fluidification de la communication inter-groupes :** Améliorer les canaux de coordination avec les équipes en aval ou plus isolées pour réduire les frictions et faciliter l'intégration de leurs briques dans le projet global.