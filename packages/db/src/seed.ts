/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import "dotenv/config";
import { reset, seed } from "drizzle-seed";
import { db } from "./index";
import * as schema from "./schema";

const majorValues = ["gene", "ir", "ti-sante", "master"];
const optionValues = [
  "aucune",
  "sdia",
  "rio",
  "ti",
  "dtmi",
  "stq",
  "ispv",
  "issd",
  "isav",
  "photo",
  "pm",
  "ese",
  "asi",
  "ht",
  "imed",
  "phynano",
  "ar",
  "id",
  "irmc",
  "mphot",
  "topo",
];

const countries = [
  "FRANCE",
  "FRANCE",
  "FRANCE",
  "FRANCE",
  "FRANCE",
  "ALLEMAGNE",
  "SUISSE",
  "BELGIQUE",
  "ROYAUME-UNI",
  "ÉTATS-UNIS",
  "CANADA",
  "JAPON",
  "LUXEMBOURG",
  "PAYS-BAS",
  "ESPAGNE",
];

const cities = [
  "Strasbourg",
  "Paris",
  "Lyon",
  "Toulouse",
  "Grenoble",
  "Mulhouse",
  "Berlin",
  "Zurich",
  "Bruxelles",
  "Londres",
  "New York",
  "Montréal",
  "Tokyo",
  "Luxembourg",
  "Amsterdam",
  "Madrid",
  "Lille",
  "Nantes",
  "Bordeaux",
  "Marseille",
];

const subjects = [
  "Développement d'une application web de gestion de données médicales",
  "Conception et mise en œuvre d'un réseau IoT pour le monitoring industriel",
  "Optimisation d'algorithmes de traitement d'images par deep learning",
  "Étude et implémentation d'un système de communication 5G",
  "Développement d'un pipeline de données pour l'analyse prédictive",
  "Conception d'un système embarqué pour la robotique médicale",
  "Mise en place d'une infrastructure cloud sécurisée",
  "Analyse de signaux biomédicaux par intelligence artificielle",
  "Développement d'un outil de simulation optique",
  "Implémentation d'un système de détection d'anomalies réseau",
  "Conception d'une interface homme-machine pour dispositif médical",
  "Étude de la propagation des ondes dans les fibres optiques",
  "Développement d'un système de vision par ordinateur pour le contrôle qualité",
  "Optimisation de la chaîne de traitement de données satellite",
  "Conception d'un capteur intelligent pour l'environnement",
  "Développement d'une plateforme de télémédecine",
  "Étude et caractérisation de nanomatériaux photoniques",
  "Mise en place d'un système de monitoring temps réel",
  "Développement d'un algorithme de reconstruction 3D",
  "Conception d'un système de commande pour drone autonome",
  "Implémentation d'un modèle de machine learning pour la maintenance prédictive",
  "Étude de faisabilité d'un dispositif d'imagerie médicale portable",
  "Développement d'une API REST pour la gestion de données cliniques",
  "Conception d'un réseau de capteurs sans fil basse consommation",
  "Optimisation d'un système de stockage distribué",
  "Développement d'un outil d'aide au diagnostic par IA",
  "Étude des propriétés optoélectroniques de matériaux innovants",
  "Mise en œuvre d'une solution de cybersécurité pour PME",
  "Développement d'un simulateur de réseau de télécommunication",
  "Conception d'un banc de test automatisé pour composants électroniques",
];

const orgNames = [
  "Siemens",
  "Thales",
  "Orange",
  "Airbus",
  "Dassault Systèmes",
  "Alcatel-Lucent",
  "STMicroelectronics",
  "Schneider Electric",
  "Capgemini",
  "Sopra Steria",
  "CNRS",
  "INSERM",
  "CEA",
  "Université de Strasbourg",
  "INRIA",
  "Hager Group",
  "Liebherr",
  "Bruker",
  "Socomec",
  "Lohr Industrie",
  "ICube",
  "IHU Strasbourg",
  "CHU Strasbourg",
  "Google",
  "Microsoft",
  "Amazon Web Services",
  "SAP",
  "BMW",
  "Bosch",
  "Philips",
];

async function main() {
  console.log("Resetting database...");
  await reset(db, schema);

  console.log("Seeding database...");
  await seed(db, schema).refine((f) => ({
    majors: {
      count: majorValues.length,
      columns: {
        alias: f.valuesFromArray({ values: majorValues, isUnique: true }),
        name: f.valuesFromArray({
          values: majorValues.map((v) => {
            const names: Record<string, string> = {
              gene: "Généraliste",
              ir: "Informatique et Réseaux",
              "ti-sante": "Technologie de l'Information pour la Santé",
              master: "Master",
            };
            return names[v] ?? v;
          }),
        }),
      },
    },
    options: {
      count: optionValues.length,
      columns: {
        alias: f.valuesFromArray({ values: optionValues, isUnique: true }),
        name: f.valuesFromArray({ values: optionValues }),
      },
    },
    organizations: {
      count: 30,
      columns: {
        name: f.valuesFromArray({ values: orgNames }),
        country: f.valuesFromArray({ values: countries }),
        city: f.valuesFromArray({ values: cities }),
        type: f.valuesFromArray({ values: ["company", "not_company"] }),
      },
    },
    students: {
      count: 100,
      columns: {
        majorAlias: f.valuesFromArray({ values: majorValues }),
        optionAlias: f.valuesFromArray({ values: optionValues }),
      },
    },
    internships: {
      count: 100,
      columns: {
        subject: f.valuesFromArray({ values: subjects }),
        beginDate: f.date({ minDate: "2022-01-10", maxDate: "2025-09-01" }),
        weeksCount: f.valuesFromArray({
          values: [4, 6, 8, 10, 12, 16, 20, 24],
        }),
        academicYear: f.valuesFromArray({ values: ["1A", "2A", "3A"] }),
        isInvalid: f.default({ defaultValue: false }),
      },
    },
  }));

  console.log("Seeding complete! 100 internships created.");
  process.exit(0);
}

main();
