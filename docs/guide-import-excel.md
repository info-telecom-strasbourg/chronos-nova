# Guide d'Import Excel pour Administrateurs

Ce guide détaille les formats attendus et les règles de validation pour l'import de stages via fichier Excel dans Chronos.

## Table des Matières

1. [Configuration de l'Import](#configuration-de-limport)
2. [Formats des Champs](#formats-des-champs)
3. [Schéma Académique](#schéma-académique)
4. [Règles de Validation](#règles-de-validation)
5. [Gestion des Erreurs](#gestion-des-erreurs)
6. [Exemples Pratiques](#exemples-pratiques)

## Configuration de l'Import

### Structure du Fichier Excel

- **Format supporté** : `.xlsx` uniquement
- **Feuilles multiples** : Supportées (sélection individuelle)
- **Ligne de départ** : Configurable par feuille
- **Année académique** : À préciser pour chaque feuille sélectionnée

### Paramètres d'Import

| Paramètre | Description | Obligatoire |
|-----------|-------------|-------------|
| Feuille | Sélection des onglets à importer | ✅ |
| Ligne de départ | Première ligne contenant les données | ✅ |
| Année académique | 1A, 2A ou 3A | ✅ |

## Formats des Champs

### 📚 Données Étudiant

#### Diplôme/Filière (`studentMajor`)

| Format Excel | Valeur Normalisée | Libellé Complet |
|--------------|-------------------|-----------------|
| `G` | `gene` | Généraliste |
| `IR` | `ir` | IR (Informatique et Réseaux) |
| `TIS` | `ti-sante` | TI Santé (Technologie de l'Information pour la Santé) |
| `M` | `master` | Master |

**✅ Formats acceptés :**
- Majuscules ou minuscules
- Avec ou sans espaces
- Forme courte ou complète (`TIS` = `ti-sante`)

**❌ Formats rejetés :**
- Valeurs vides
- Caractères spéciaux (`?`, `X`, `x`)
- Diplômes non reconnus

#### Option/Spécialité (`studentOption`)

**Options IR (2A et 3A) :**
| Format Excel | Valeur Normalisée | Libellé |
|--------------|-------------------|---------|
| `SDIA` | `sdia` | Science des Données et Intelligence Artificielle |
| `RIO` | `rio` | Réseaux Informatiques et Objets connectés |

**Options TI Santé (2A et 3A) :**
| Format Excel | Valeur Normalisée | Libellé |
|--------------|-------------------|---------|
| `TI` | `ti` | Technologie de l'Information |
| `DTMI` | `dtmi` | Dispositifs Thérapeutiques et Maintenance Industrielle |

**Options Généraliste (3A uniquement) :**
| Format Excel | Valeur Normalisée | Libellé |
|--------------|-------------------|---------|
| `STQ` | `stq` | Sciences et Technologies Quantiques |
| `ISPV` | `ispv` | Image, Signal, Photonique et Vision |
| `ISSD` | `issd` | Ingénierie des Systèmes et Sécurité des Données |
| `ISAV` | `isav` | Ingénierie des Systèmes Automobiles et de Véhicules |
| `Photo` | `photo` | Photonique |
| `PM` | `pm` | Physique et Modélisation |
| `ESE` | `ese` | Électronique et Systèmes Embarqués |

**Options Master (2A et 3A) :**
| Format Excel | Valeur Normalisée | Libellé |
|--------------|-------------------|---------|
| `ASI` | `asi` | Automatique, Signal, Informatique |
| `HT` | `ht` | HealthTech |
| `IMed` | `imed` | Imagerie Médicale |
| `PhyNano` | `phynano` | Physique et Nanophotonique |
| `AR` | `ar` | Automatique et Robotique |
| `ID` | `id` | Images et Données |
| `IRMC` | `irmc` | Imagerie, Robotique Médicale et Chirurgicale |
| `MPHOT` | `mphot` | Photonique pour les nanosciences et le vivant |
| `Topo` | `topo` | Topographie et photogrammétrie |

**✅ Cas spéciaux acceptés :**
- `Aucune` → `aucune`

### 🏢 Données Organisation

#### Nom de l'Organisation (`organizationName`)

**✅ Formats acceptés :**
- Tout texte non vide
- Espaces automatiquement normalisés
- Caractères spéciaux autorisés

**❌ Formats rejetés :**
- Cellules vides
- Valeurs `?`, `X`, `x`

#### Type d'Organisation (`organizationType`)

| Format Excel | Valeur Normalisée | Libellé |
|--------------|-------------------|---------|
| `E` | `company` | Entreprise |
| `L` | `not_company` | Hors Entreprise |

**✅ Formats acceptés :**
- `E`, `e`, `Entreprise`, `company`
- `L`, `l`, `Laboratoire`, `not_company`

#### Pays (`organizationCountry`)

**✅ Formats acceptés :**
- Noms complets : `France`, `Allemagne`, `Espagne`

**🔄 Normalisation automatique :**
- Ajout des tirets et mise en majuscule :
  - pays bas → `PAYS-BAS`
  - Pays-bas → `PAYS-BAS`

**❌ Formats rejetés :**
- Codes pays : `FR`, `DE`, `ES`
- Cellules vides
- Valeurs `?`, `X`, `x`
- Pays non reconnus

#### Ville (`organizationCity`)

**✅ Formats acceptés :**
- Tout texte non vide
- Première lettre automatiquement en majuscule
- Espaces et tirets normalisés

### 📋 Données de Stage

#### Sujet (`subject`)

**✅ Formats acceptés :**
- Tout texte descriptif non vide
- Caractères spéciaux autorisés
- Espaces préservés

#### Date de Début (`beginDate`)

**✅ Formats acceptés :**
- `AAAA-MM-JJ` : `2025-06-02`
- `JJ/MM/AAAA` : `02/06/2025`
- `JJ-MM-AAAA` : `02-06-2025`

**🔄 Normalisation :**
- Tous les formats → `AAAA-MM-JJ`
- Validation des dates réelles

**⚠️ Format causant des erreurs sans rejet :**
- Dates invalides (31/02/2025) : converti en 2025-03-03 

**❌ Formats rejetés :**
- Formats non reconnus
- Cellules vides

#### Durée (`weeksCount`)

**✅ Formats acceptés :**
- Nombres entiers : `12`, `16`, `24`
- Texte avec nombre : `12 semaines`, `16 weeks`
- Formules Excel retournant un nombre

**🔄 Extraction automatique :**
- `12 semaines` → `12`
- `16 weeks` → `16`
- `24 sem.` → `24`

**❌ Formats rejetés :**
- Valeurs négatives ou nulles
- Texte sans nombre
- Cellules vides

#### Année Académique (`academicYear`)

**✅ Valeurs acceptées :**
- `1A`, `2A`, `3A` uniquement
- Configurée au niveau de la feuille

## Schéma Académique

Le système valide automatiquement la cohérence entre l'année académique, le diplôme et l'option selon le schéma suivant :

### Structure Académique

```javascript
{
  "1A": {
    "gene": {
      "label": "Généraliste",
      "options": [] // Aucune option en 1A
    },
    "ir": {
      "label": "IR",
      "options": [] // Aucune option en 1A
    },
    "ti-sante": {
      "label": "TI Santé",
      "options": [] // Aucune option en 1A
    }
  },
  "2A": {
    "gene": {
      "label": "Généraliste",
      "options": [] // Pas d'options en 2A
    },
    "ir": {
      "label": "IR",
      "options": [
        { "value": "rio", "label": "RIO" },
        { "value": "sdia", "label": "SDIA" }
      ]
    },
    "ti-sante": {
      "label": "TI Santé",
      "options": [
        { "value": "ti", "label": "TI" },
        { "value": "dtmi", "label": "DTMI" }
      ]
    },
    "master": {
      "label": "Master",
      "options": [
        { "value": "asi", "label": "ASI" },
        { "value": "ht", "label": "HT" },
        { "value": "imed", "label": "IMed" },
        { "value": "phynano", "label": "PhyNano" }
      ]
    }
  },
  "3A": {
    "gene": {
      "label": "Généraliste",
      "options": [
        { "value": "pm", "label": "PM" },
        { "value": "stq", "label": "STQ" },
        { "value": "photo", "label": "Photonique" },
        { "value": "ispv", "label": "ISPV" },
        { "value": "issd", "label": "ISSD" },
        { "value": "isav", "label": "ISAV" },
        { "value": "ese", "label": "ESE" }
      ]
    },
    "ir": {
      "label": "IR",
      "options": [
        { "value": "rio", "label": "RIO" },
        { "value": "sdia", "label": "SDIA" }
      ]
    },
    "ti-sante": {
      "label": "TI Santé",
      "options": [
        { "value": "ti", "label": "TI" },
        { "value": "dtmi", "label": "DTMI" }
      ]
    },
    "master": {
      "label": "Master",
      "options": [
        { "value": "id", "label": "ID" },
        { "value": "ht", "label": "HT" },
        { "value": "ar", "label": "AR" },
        { "value": "irmc", "label": "IRMC" },
        { "value": "mphot", "label": "MPHOT" },
        { "value": "topo", "label": "Topo" }
      ]
    }
  }
}
```

### Règles de Cohérence

1. **1A** : Seuls les diplômes de base sont autorisés, aucune option
2. **2A** : Options disponibles pour IR, TI Santé et Master
3. **3A** : Options disponibles pour tous selon le diplôme

### Validation Automatique

- ✅ **Cohérent** : `2A + IR + SDIA` → Accepté
- ❌ **Incohérent** : `1A + IR + SDIA` → Option forcée à `__inconnu__`
- ❌ **Incohérent** : `2A + gene + STQ` → Option forcée à `__inconnu__`

## Règles de Validation

### Niveau d'Import (Permissif)

L'import accepte les données incomplètes qui seront marquées comme "mal importées" :

- ✅ Valeurs null/vides acceptées
- ✅ Valeurs `__inconnu__` acceptées
- ✅ Données incohérentes acceptées (corrigées automatiquement)

### Niveau d'Approbation (Strict)

Pour qu'un stage puisse être approuvé, **tous** les champs doivent être valides :

- ❌ Aucune valeur null
- ❌ Aucune valeur `__inconnu__`
- ❌ Toutes les données doivent être cohérentes
- ❌ Aucun doublon approuvé existant

## Gestion des Erreurs

### Types de Stages Après Import

1. **✅ Stages Valides** : Toutes les données sont complètes et cohérentes
2. **⚠️ Stages Incomplets** : Données manquantes ou incohérentes (marqués `isInvalid: true`)
3. **🔄 Doublons Suspectés** : Hash identique à un stage déjà approuvé

### Statuts des Stages

- **`draft`** : Stage importé en attente de validation
- **`visible`** : Stage approuvé et publiquement visible
- **`deleted`** : Stage supprimé (soft delete)

## Exemples Pratiques

### ✅ Ligne Excel Valide

| Colonne | Valeur | Résultat |
|---------|--------|----------|
| Nom | `Apple Inc.` | ✅ |
| Type | `E` | `company` |
| Pays | `fr` | `France` |
| Ville | `paris` | `Paris` |
| Sujet | `Développement d'une app mobile` | ✅ |
| Date | `02/06/2025` | `2025-06-02` |
| Durée | `16 semaines` | `16` |
| Diplôme | `IR` | `ir` |
| Option | `SDIA` | `sdia` |

### ⚠️ Ligne Excel Incomplète (Acceptée mais Marquée)

| Colonne | Valeur | Résultat |
|---------|--------|----------|
| Nom | `???` | `null` |
| Type | `?` | `null` |
| Pays | `x` | `null` |
| Ville | | `null` |
| Sujet | `Stage IA` | ✅ |
| Date | `2025-06-02` | ✅ |
| Durée | `12` | ✅ |
| Diplôme | `Info` | `__inconnu__` |
| Option | `SDIA` | `sdia` |

→ **Statut** : `isInvalid: true` (nécessite correction avant approbation)

### ❌ Incohérence Corrigée Automatiquement

**Données Excel :**
- Année : `1A`
- Diplôme : `IR`
- Option : `RIO`

**Résultat :**
- Diplôme : `ir` ✅
- Option : `__inconnu__` (corrigé car RIO n'existe pas en 1A)

### 🔍 Détection de Doublons

Deux stages sont considérés comme doublons s'ils ont le même hash calculé à partir de :

- Nom de l'organisation
- Type d'organisation  
- Pays de l'organisation
- Ville de l'organisation
- Sujet du stage
- Date de début
- Durée en semaines
- Année académique

## Conseils pour un Import Réussi

### 🎯 Préparation du Fichier

1. **Vérifiez la cohérence** année/diplôme/option avant import
2. **Vérifiez que les dates existent** et sont au bon format
2. **Normalisez les pays** (utilisez les noms complets)
3. **Précisez les durées** en nombre de semaines
4. **Évitez les cellules vides** quand possible

### 📊 Surveillance de l'Import

1. Consultez le **résumé d'import** après chaque opération
2. Vérifiez si le nombre de stages importés correspond à vos attentes
3. Vérifiez les **stages incomplets** dans l'onglet "En attente"
4. Corrigez les **données incohérentes** avant approbation
5. Surveillez les **doublons suspectés**

### 🔧 Correction des Erreurs

1. Utilisez l'**édition individuelle** pour corriger les stages incomplets
2. **Supprimez les doublons** non désirés
3. **Validez la cohérence** avant approbation

