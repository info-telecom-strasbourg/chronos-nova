# Cahier des Charges - Chronos

## Contexte

Chronos est une plateforme web développée par l'association étudiante ITS de Télécom Physique Strasbourg, en collaboration avec le service informatique de l'école. Elle sert d'annuaire des stages effectués par les étudiants de l'école, facilitant ainsi la recherche de stages pour les promotions suivantes.

Cette plateforme est actuellement disponible et utilisée par les étudiants, mais elle présente certaines limitations qui nécessitent une refonte complète. Ce projet est ainsi découpé en deux stages de 5 semaines chacun, réalisés sur deux années consécutives, avec pour objectif de moderniser la plateforme pour mieux correspondre aux besoins des utilisateurs et de l'école.

## Objectifs du projet

L'objectif principal de ce projet est de refaire complètement la plateforme Chronos pour qu'elle soit mise en production pour la rentrée de septembre 2026.
Dans un premier temps, une version intermédiaire sera mise en place pour la rentrée de septembre 2025, afin de répondre aux besoins immédiats des étudiants et du personnel de la scolarité.

Voici la liste des objectifs à atteindre :

- Simplification des démarches de recherche de stage pour les étudiants en proposant une interface intuitive. L'idée est d'améliorer l'expérience utilisateur pour les étudiants.
- Permettre aux étudiants de consulter les détails des stages passés, en faisant la demande à la scolarité pour obtenir les informations sensibles. (pas en priorité)
- Simplification de l'ajout de nouveaux stages par la scolarité via un formulaire et l'importation de documents Excel. (l'ajout d'excel doit être disponible pour la rentrée de septembre 2025)
- Assurer la maintenance dans le temps en utilisant des technologies modernes et faciles à prendre en main pour le service informatique.
- Garantir la conformité avec les réglementations RGPD.

## Fonctionnalités attendues

En tant qu'étudiant, je veux pouvoir :

- Rechercher des stages passés via un formulaire de recherche avec des champs de recherche, des filtres et un tri : recherche par mot-clé, type de stage (entreprise ou hors entreprise), localisation (pays, ville), année, filière, entreprise et autres critères pertinents.
- Consulter les détails d'un stage, y compris le sujet de stage, le type d'organisation d'accueil, le lieu, le contact de l'étudiant et du tuteur entreprise, les dates du stage, le diplôme.
- M'authentifier via le CAS Unistra pour accéder à la plateforme sans avoir à créer un compte spécifique.

En tant que personnel de la scolarité, je veux pouvoir :

- Importer directement des fichiers Excel pour ajouter des stages à la base de données.
- Avoir une interface administrateur pour faciliter l'ajout de nouveaux stages, ainsi que la gestion des demandes d'accès aux informations détaillées des stages (comme les contacts d'entreprise) via un formulaire de demande (encore à définir pour le stage de l'année 2026).

## Contraintes techniques

### Pages du site

- Page d'accueil : formulaire de recherche de stage et liste des stages.
- Page de détails d'un stage : permet de visualiser les informations détaillées d'un stage. Elle n'est accessible qu'aux utilisateurs authentifiés et ayant fait une demande pour accéder à ces informations.
- Page authentification : permet de se connecter via le CAS Unistra.
- Page administrateur : permet à la scolarité d'ajouter un nouveau stage via un formulaire ou en important un fichier Excel (page privée aux administrateurs).

### Front-end

- Utilisation du framework react Next.js pour le développement de l'interface utilisateur.
- Utilisation de Tailwind CSS pour le style et la mise en page.
- Utilisation de Shadcn pour les composants UI.
- Utilisation de Nuqs et ReactHookForm pour la gestion des formulaires et des validations.
- Le site doit être responsive et accessible sur tous les appareils (ordinateurs, tablettes, smartphones).

### Back-end

- Utilisation de Supabase pour la gestion de la base de données et éventuellement le stockage de fichiers.
- Authentification via le CAS Unistra pour sécuriser l'accès à la plateforme.
- Structure de la base de données à définir.

## Livrables attendus

- Pour septembre 2025, la partie ajout de stages via un formulaire excel doit être absolument fonctionnelle sans erreur bloquante. Si possible, la partie recherche de stage doit également être disponible.
- Le code doit passer sans erreur sur les tests unitaires et d'intégration sur GitHub.
- Le repository GitHub doit être organisé de manière claire, avec des branches pour chaque fonctionnalité développée.
- Une documentation détaillée du projet, incluant les instructions d'installation, de configuration et d'utilisation doit permettre à un développeur de reprendre le projet facilement, et au service informatique de l'école de faire le minimum pour maintenir la plateforme dans le temps.
- Le rapport de stage permet également de présenter les choix techniques, les difficultés rencontrées et les solutions apportées et agit comme complément de la documentation.
