# 🎤 G2 — Démo finale, Jour 10

**Format :** 10 minutes — Personne A (4 min) → Personne B (3 min) → Questions (3 min)
**Personne A :** Morleye Max — présentation & manipulation Swagger
**Personne B :** Aachraf — zoom technique & conclusion

---

## 🔑 À préparer AVANT de passer

- [ ] Stack lancée et `healthy` (`docker compose ps`)
- [ ] Swagger ouvert sur un onglet, déjà authentifié avec le token ADMIN
- [ ] Les deux tokens copiés dans un fichier texte ouvert à côté
- [ ] Un étudiant déjà créé en base pour la démo du doublon
- [ ] Si la prod est en ligne : le Swagger public ouvert dans un 2ᵉ onglet

**Comptes de démo :** `admin.demo@ept.sn` / `etudiant.demo@ept.sn` — mot de passe `MotDePasse123!`
⚠️ Le token émis à l'inscription porte le rôle ETUDIANT. Pour un token ADMIN, il faut se **reconnecter** après la promotion en base.

---

## 🎬 Personne A — 4 minutes (rappel, pour la transition)

1. **(30 s)** Rôle du module : le CRUD central, consommé par le front de G6/G7 et par les inscriptions de G3.
2. **(1 min)** `GET /api/etudiants?page=0&size=5&sortBy=nom` → montrer `content`, `totalElements`, `totalPages`. Relancer avec `sortBy=age`.
3. **(1 min 30)** Le trio sécurité : même `POST`, trois résultats — sans token **401**, token ETUDIANT **403**, token ADMIN **201**.
4. **(1 min)** `POST` avec `age: 10` → **400** avec un message métier en français.

**Phrase de passage :** « Je laisse Aachraf expliquer comment tout ça est construit derrière. »

---

## 🎯 Personne B — VOS 3 MINUTES

### Bloc 1 — La sécurité par rôle (1 min 15)

> « Ce que vous venez de voir avec les trois codes, ce n'est pas trois configurations différentes. C'est une seule règle, déclarée sur les méthodes du contrôleur. »

Montrer `EtudiantController` :

```java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<EtudiantResponse> create(@Valid @RequestBody EtudiantRequest request) {
```

Les trois points à faire passer :

1. **Lectures publiques, écritures réservées.** `@PreAuthorize` uniquement sur `POST`, `PUT` et `DELETE`. Aucune annotation sur les `GET` : le front peut afficher la liste sans authentifier personne.
2. **401 ≠ 403.** « 401, c'est *je ne sais pas qui tu es*. 403, c'est *je sais qui tu es, mais tu n'as pas le droit*. » Préciser que c'était un vrai bug : on renvoyait 403 dans les deux cas, corrigé au Jour 5.
3. **C'est testé, pas juste configuré.** `EtudiantControllerSecurityTest` couvre exactement les six cas montrés à l'écran : `401`/`403`/`201` sur la création, `401`/`403`/`204` sur la suppression, plus le token invalide.

### Bloc 2 — Les DTO et la validation (1 min)

> « L'entité JPA n'est jamais exposée à l'extérieur. Ce qui entre et ce qui sort, ce sont des DTO. »

```java
public record EtudiantRequest(
    @NotBlank(message = "Le nom est requis") String nom,
    @Email(message = "Email invalide") @NotBlank String email,
    @Min(value = 15, message = "L'âge doit être au minimum 15") int age,
    ...
) {}
```

**L'argument fort — ce que ça a permis concrètement :** au Jour 4, on est passés d'un stockage en mémoire (`Map<Long, Etudiant>`) à une vraie persistance JPA. L'entité a complètement changé. **Le front n'a pas eu une seule ligne à modifier**, parce que le contrat d'API, lui, n'avait pas bougé. C'est exactement ce à quoi sert le découplage.

Enchaîner sur le format d'erreur unique : `@Valid` échoue → `GlobalExceptionHandler` → `ErreurResponse`, la structure commune définie par G1. Même forme pour le 400 de validation, le 401 de sécurité et le 409 de conflit. L'intercepteur Angular de G7 n'a qu'un seul format à savoir lire.

### Bloc 3 — Conclusion (45 s)

> « En résumé, l'API Étudiants a suivi une trajectoire en cinq temps : CRUD en mémoire au Jour 2, DTO et Swagger au Jour 3, persistance JPA avec pagination au Jour 4, sécurité par rôle au Jour 5, puis intégration avec le front jusqu'au Jour 8. »

> « Et ce matin encore, en testant la stack complète avant la démo, on a trouvé et corrigé un dernier défaut : un email en doublon renvoyait un 500. Ça renvoie maintenant un **409 Conflict** avec un message clair. Une erreur prévue, c'est une erreur gérée. »

*(Cette dernière phrase est votre meilleur atout : elle montre que vous testez encore le jour J.)*

---

## 💬 Questions du jury — réponses préparées

| Question | Réponse |
|---|---|
| Pourquoi des DTO plutôt que l'entité ? | Découpler le contrat d'API du schéma en base. On a changé toute la persistance au Jour 4 sans casser le front. Et on ne fuite aucun champ interne. |
| Différence entre 401 et 403 ? | 401 = identité non prouvée. 403 = identité connue, droits insuffisants. Les deux sont testés explicitement. |
| La pagination, en base ou en mémoire ? | En base. Le `Pageable` est transmis au `JpaRepository`, le `LIMIT`/`OFFSET` est dans la requête SQL. On ne charge jamais toute la table. |
| Comment gérez-vous les erreurs ? | Un `@RestControllerAdvice` unique qui produit toujours un `ErreurResponse`. Validation → 400, conflit d'unicité → 409, sécurité → 401/403. |
| Pourquoi 409 et pas 400 sur le doublon ? | La requête est bien formée, elle est valide. Ce qui la refuse, c'est l'état de la ressource. 409 Conflict est le code prévu pour ça. |
| Et si deux requêtes créent le même email en même temps ? | La contrainte `uq_etudiant_email` en base tranche. La seconde lève une `DataIntegrityViolationException`, interceptée et traduite en 409. La base reste l'arbitre final. |

---

## ⚠️ Pièges à éviter le jour J

- **Ne pas régénérer les tokens en direct.** Ils sont valables 24 h, générez-les avant de passer.
- **Ne pas improviser un `DELETE` sur un id au hasard** → 404 en pleine démo. Créez l'étudiant juste avant, notez son id.
- **Si Swagger renvoie 403 alors que vous pensez être ADMIN** : le token vient d'un `register`, il porte ETUDIANT. Reconnectez-vous.
- **Ne pas dépasser 3 minutes.** Si le temps manque, sacrifiez le bloc 2 et gardez la sécurité + la conclusion.

---

## ✅ Ce qui est validé à ce stade

- Les 10 routes G2 testées en local : `200`, `404`, `401`, `403`, `201`, `400`, `200`, `204` — toutes conformes
- `/actuator/health` → `200 {"status":"UP"}` après le correctif de G5 (PR #90)
- Backend `healthy` en 27 s, front servi par Nginx sur `:4200`
- Doublon d'email → `409` au lieu de `500`, couvert par `GlobalExceptionHandlerTest`
- **Reste à faire :** rejouer la checklist sur l'URL publique dès que G8 la livre
