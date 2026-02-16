# Guide d'Installation et d'Exécution du Projet

Ce document vous guidera à travers toutes les étapes nécessaires pour installer et exécuter ce projet sur votre machine locale.

##  À propos du projet

**Food Eiland** est une application full-stack de gestion des recettes comprenant :
- **Frontend** : Application Next.js (React) - Port 3000
- **Backend** : (Nest) API REST - Port 8080  
- **Base de données** : MongoDB - Port 27017
- **Stockage d'images** : Cloudinary (service cloud)

L'application utilise l'authentification JWT (JSON Web Tokens) pour sécuriser les accès et Cloudinary pour gérer les images .

---

##  Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Docker** 
- **Docker Compose** 
- **Git** 

Pour vérifier si Docker est installé, exécutez :
```bash
docker --version
docker-compose --version
```

---

## Installation

### Étape 1 : Récupérer le code source -Cloner le dépôt avec Git
Si vous utilisez Git, clonez le dépôt en exécutant la commande suivante dans votre terminal :

```bash
git clone https://github.com/imanesahraoui/Foodieland.git
```


Ensuite, accédez au répertoire du projet .



---

### Étape 2 : Configurer les variables d'environnement

Le projet nécessite un fichier de configuration contenant les variables d'environnement. Ce fichier permet de configurer la base de données, les ports et d'autres paramètres essentiels.

#### Créer le fichier `.env`

À la racine du projet, créez un fichier nommé `.env` :

```bash
touch .env
```

Ou créez-le manuellement avec votre éditeur de texte préféré.

#### Ajouter les variables d'environnement

Copiez et collez le contenu suivant dans le fichier `.env` :

```env

# Nom d'utilisateur MongoDB
# Cet utilisateur aura les droits d'administration sur la base de données
MONGO_USERNAME=

# Mot de passe MongoDB
MONGO_PASSWORD=

# Nom de la base de données
MONGO_DB_NAME=

# Hôte MongoDB
MONGO_HOST=

# Port MongoDB par défaut 
MONGO_PORT=

# Clé secrète pour les tokens de rafraîchissement (Refresh Token)
# Les refresh tokens permettent d'obtenir de nouveaux access tokens sans se reconnecter
JWT_REFRESH_SECRET=your_refresh_token_secret
# Clé secrète pour les tokens d'accès (Access Token)
# Les access tokens sont utilisés pour authentifier les requêtes API
JWT_ACCESS_SECRET=your_access_token_secret



# Mode d'exécution de l'application
# Valeurs possibles : "dev" (développement) ou "prod" (production)
MODE=dev

# URL de base de l'API (accessible publiquement)
# Utilisée par le frontend pour communiquer avec le backend
NEXT_PUBLIC_BASE_URL=http://localhost:8080

# Port sur lequel le backend sera accessible
# Le serveur API écoutera sur ce port
PORT=8080

# Adresse d'écoute du serveur
# 0.0.0.0 permet d'accepter les connexions de toutes les interfaces réseau
# Nécessaire pour que Docker puisse exposer le service
HOST=0.0.0.0

# URL du frontend
# Utilisée pour la configuration CORS (autoriser les requêtes depuis le frontend)
FRONTNED_URL=http://localhost:3000



# Nom du cloud Cloudinary
# Identifiant unique de votre compte Cloudinary
CLOUDINARY_CLOUD_NAME=

# Clé API Cloudinary
# Utilisée pour authentifier les requêtes vers l'API Cloudinary
CLOUDINARY_API_KEY=

# Secret API Cloudinary
# Clé secrète pour signer les requêtes d'upload d'images
CLOUDINARY_API_SECRET=
```


####  Configuration spécifique pour Docker

Si vous utilisez Docker Compose, modifiez la variable `MONGO_HOST` :

```env
# Au lieu de localhost, utilisez le nom du service Docker
MONGO_HOST=food-eiland-db
```

Cette modification est nécessaire car dans Docker Compose, les conteneurs communiquent entre eux via leur nom de service (défini dans `docker-compose.yml`), et non via `localhost`.

---


### Étape 3 : Construire et démarrer les conteneurs Docker

Une fois le fichier `.env` configuré, vous pouvez construire et démarrer l'application avec Docker Compose.

Exécutez la commande suivante à la racine du projet :

```bash
docker-compose up --build -d
```

#### Détails de la commande

- `docker-compose` : Outil pour gérer les applications multi-conteneurs
- `up` : Démarre les conteneurs
- `--build` : Reconstruit les images Docker avant de les démarrer
- `-d` : Mode détaché (les conteneurs s'exécutent en arrière-plan)

#### Que se passe-t-il lors du build ?

1. **Construction des images Docker** : Docker crée les images pour chaque service (application, base de données, etc.)
2. **Démarrage des conteneurs** : Les conteneurs sont lancés en arrière-plan
3. **Initialisation de la base de données** : MongoDB démarre et crée l'utilisateur administrateur
4. **Remplissage automatique de la base de données** : Un script JavaScript lit les fichiers JSON présents dans le dossier `mongo-seed` et insère automatiquement les données dans la base de données MongoDB. Cela permet de disposer immédiatement de données de test pour faciliter le développement et les tests de l'application.

---



### Accéder à l'application

Une fois les conteneurs démarrés, les services devraient être accessibles aux adresses suivantes :

- **Frontend (Next.js)** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **MongoDB** : food-eiland-db:27017

---

##  Commandes utiles

### Arrêter les conteneurs

Pour arrêter tous les conteneurs sans les supprimer :

```bash
docker-compose stop
```

### Redémarrer les conteneurs

Pour redémarrer les conteneurs arrêtés :

```bash
docker-compose start
```

### Arrêter et supprimer les conteneurs

Pour arrêter et supprimer complètement les conteneurs :

```bash
docker-compose down
```

 **Attention** : Cette commande supprime les conteneurs mais conserve les volumes (données de la base de données).

Pour supprimer également les volumes  :

```bash
docker-compose down -v
```
### Accéder au compte admin
Pour vous authentifier au compte administrateur, merci de saisir les informations suivantes : 

email : admin@foodie-land.com

mot de passe : admin123
