# Chronos Nova

Annuaire des stages de Telecom Physique Strasbourg.

## Architecture

Monorepo pnpm avec deux apps Next.js et des packages partages :

```
apps/
  client/    - App publique (Next.js 16, RSC, React Compiler)
  admin/     - Dashboard admin (Version instable supabase)
packages/
  db/        - Schema Drizzle ORM, queries, seed
  env/       - Variables d'environnement validees avec Zod
  ui/        - Composants partages (Base UI + Tailwind)
```

## Prerequis

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 9
- [Docker](https://www.docker.com/) et Docker Compose

## Variables d'environnement

Creer un fichier `.env` a la racine :

```env
DB_NAME=chronos
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

| Variable      | Requis | Default     | Description                   |
| ------------- | ------ | ----------- | ----------------------------- |
| `DB_NAME`     | oui    |             | Nom de la base de donnees     |
| `DB_USER`     | oui    |             | Utilisateur PostgreSQL        |
| `DB_PASSWORD` | oui    |             | Mot de passe PostgreSQL       |
| `DB_HOST`     | non    | `localhost` | Hote de la base de donnees    |
| `DB_PORT`     | non    | `5432`      | Port de la base de donnees    |
| `DB_SSL`      | non    | `false`     | Activer SSL pour la connexion |

## Developpement local

```bash
# Installer les dependances
pnpm install

# Lancer PostgreSQL
docker compose up postgres -d

# Pousser le schema en base
pnpm --filter @chronos/db db:push

# (Optionnel) Remplir la base avec des donnees de test
pnpm --filter @chronos/db db:seed

# Lancer les apps en dev
pnpm dev
```

L'app client est accessible sur `http://localhost:3000`.

### Commandes utiles

```bash
pnpm build                            # Build tous les packages
pnpm lint                             # Lint + format (Biome)
pnpm lint:fix                         # Auto-fix
pnpm --filter @chronos/db db:studio   # Ouvrir Drizzle Studio
```

## Deploiement Docker

Tout le stack se lance avec Docker Compose :

```bash
docker compose up --build
```

Cela demarre 4 services :

| Service      | Description                       | Port |
| ------------ | --------------------------------- | ---- |
| `postgres`   | Base de donnees PostgreSQL        | 5432 |
| `db-migrate` | Pousse le schema puis s'arrete    | -    |
| `client`     | App Next.js (standalone)          | 3000 |
| `studio`     | Drizzle Studio (visualisation DB) | 4983 |

L'ordre de demarrage est gere automatiquement :

1. `postgres` demarre et attend d'etre healthy
2. `db-migrate` pousse le schema puis s'arrete
3. `client` demarre une fois le schema applique
4. `studio` demarre des que postgres est healthy

### Seeder la base en Docker

```bash
docker compose run --rm db-migrate pnpm --filter @chronos/db db:seed
```

### Rebuild apres modification

```bash
docker compose up --build
```

### Reset complet (supprime les donnees)

```bash
docker compose down -v
docker compose up --build
```

## Licence

MIT - Voir [LICENSE](./LICENSE)
