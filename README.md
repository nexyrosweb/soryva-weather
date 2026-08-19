<div align="center">
  <img src="./public/soryva-logo.svg" alt="Soryva Weather logo" width="420" />

  # Soryva Weather

  **Météo pour ce que vous faites vraiment.**  
  **Weather for what you actually do.**

  Application météo décisionnelle en français et en anglais.  
  A decision-first weather app available in French and English.
</div>

## Aperçu / Preview

| Français | English |
| --- | --- |
| <img src="./public/screenshot-fr.png" alt="Aperçu Soryva Weather en français" width="420" /> | <img src="./public/screenshot-en.png" alt="Soryva Weather English preview" width="420" /> |

---

# Français

## À propos

Soryva Weather est une application météo décisionnelle. Au lieu d'afficher uniquement la température, la pluie ou le vent, elle répond à une question simple :

> Est-ce le bon moment pour faire cette activité ?

L'utilisateur choisit une activité, recherche une ville, puis Soryva analyse les prochaines 24 heures de météo pour proposer une recommandation claire.

## Fonctionnalités

- Recommandations météo selon l'activité
- Recherche de ville avec l'API de géocodage Open-Meteo
- Score météo sur les prochaines 24 heures
- Détection du meilleur créneau
- Statuts simples : Go, Maybe, No
- Explications pour chaque recommandation
- Timeline horaire
- Texte de recommandation partageable
- Interface en français et en anglais
- Design responsive et moderne
- Aucun compte, base de données, clé API payante ou secret serveur requis

## Activités disponibles

Soryva prend actuellement en charge :

- Cyclisme
- Course
- BBQ
- Linge
- Voiture
- Terrasse
- Pique-nique
- Observation astronomique

Chaque activité possède ses propres règles météo : température, pluie, vent, humidité, nuages, UV et conditions générales.

## Stack technique

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- next-intl
- Lucide React
- API météo Open-Meteo
- API géocodage Open-Meteo

## Installation

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir l'application :

```text
http://localhost:3000
```

Créer le build de production :

```bash
npm run build
```

Lancer ESLint :

```bash
npm run lint
```

Lancer le serveur de production :

```bash
npm run start
```

## Internationalisation

L'application prend en charge deux langues :

- Français : `/fr`
- Anglais : `/en`

Les traductions sont dans :

```text
messages/fr.json
messages/en.json
```

Les routes localisées sont gérées avec le dossier :

```text
app/[locale]/
```

## Fonctionnement du score

Les activités sont définies dans :

```text
data/activities.ts
```

Le moteur de scoring évalue chaque heure de prévision avec un score de 0 à 100 selon :

- le confort de température
- la probabilité de pluie
- les précipitations
- la vitesse du vent et les rafales
- l'humidité
- la condition météo
- les préférences optionnelles de nuages et d'UV

Les scores sont convertis en statuts simples :

| Score | Statut |
| --- | --- |
| 70-100 | Go |
| 40-69 | Maybe |
| 0-39 | No |

Le meilleur créneau est calculé en comparant les prochaines 24 heures et en sélectionnant la meilleure fenêtre de 1 ou 2 heures.

---

# English

## About

Soryva Weather is a decision-first weather app. Instead of only showing temperature, rain, or wind, it answers one practical question:

> Is this a good moment for this activity?

The user picks an activity, searches for a city, and Soryva analyzes the next 24 hours of weather to return a clear recommendation.

## Features

- Activity-based weather recommendations
- City search powered by Open-Meteo geocoding
- 24-hour weather scoring
- Best time window detection
- Simple statuses: Go, Maybe, No
- Explanation for each recommendation
- Hourly timeline
- Shareable recommendation text
- French and English interface
- Responsive modern UI
- No account, database, paid API key, or server secret required

## Available activities

Soryva currently supports:

- Cycling
- Running
- BBQ
- Dry laundry
- Wash car
- Terrace
- Picnic
- Stargazing

Each activity has its own weather rules for temperature, rain, wind, humidity, clouds, UV, and general conditions.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- next-intl
- Lucide React
- Open-Meteo Forecast API
- Open-Meteo Geocoding API

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Start the production server:

```bash
npm run start
```

## Internationalization

The app supports two locales:

- French: `/fr`
- English: `/en`

Translations are stored in:

```text
messages/fr.json
messages/en.json
```

Localized routes are handled through:

```text
app/[locale]/
```

## How scoring works

Activities are defined in:

```text
data/activities.ts
```

The scoring engine evaluates each forecast hour from 0 to 100 using:

- temperature comfort
- rain probability
- precipitation
- wind speed and gusts
- humidity
- weather condition
- optional cloud cover and UV preferences

Scores are converted into simple statuses:

| Score | Status |
| --- | --- |
| 70-100 | Go |
| 40-69 | Maybe |
| 0-39 | No |

The best time window is calculated by comparing the next 24 hours and selecting the strongest 1-hour or 2-hour window.

---

## Project structure

```text
app/
  [locale]/
  globals.css
  layout.tsx
  icon.svg
components/
  app/
  ActivityCard.tsx
  ActivitySelector.tsx
  CitySearch.tsx
  Header.tsx
  HourlyTimeline.tsx
  RecommendationCard.tsx
  ScoreBadge.tsx
  ScoreReasons.tsx
  ShareButton.tsx
  WeatherStats.tsx
data/
  activities.ts
i18n/
  request.ts
lib/
  bestTime.ts
  format.ts
  geocoding.ts
  i18n.ts
  openMeteo.ts
  scoring.ts
  share.ts
  weatherCodes.ts
messages/
  en.json
  fr.json
public/
  screenshot-fr.png
  screenshot-en.png
  soryva-logo.svg
```

## Environment

No API key is required. Soryva uses the public Open-Meteo APIs.

You can copy the example environment file if needed:

```bash
cp .env.example .env.local
```

## License

This project is licensed under the MIT License.
