import { drizzle } from "drizzle-orm/postgres-js";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";

const majors = [
  { alias: "ir", name: "Informatique et Réseaux" },
  {
    alias: "ti-sante",
    name: "Technologies de l'Information pour la Santé",
  },
  { alias: "generaliste", name: "Généraliste" },
];

const options = [
  {
    alias: "sdia",
    name: "Science des Données et Intelligence Artificielle",
  },
  {
    alias: "rio",
    name: "Réseaux et Internet des Objets",
  },
];

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  await reset(db, schema);

  await seed(db, schema).refine((funcs) => ({
    organizations: {
      count: 1000,
      columns: {
        name: funcs.companyName(),
        country: funcs.country(),
        city: funcs.city(),
      },
    },
    students: {
      count: 1000,
      columns: {
        firstName: funcs.firstName(),
        lastName: funcs.lastName(),
      },
    },
    internships: {
      count: 1000,
      columns: {
        subject: funcs.jobTitle(),
        confidential: funcs.boolean(),
        beginDate: funcs.date(),
        period: funcs.interval(),
        year: funcs.year(),
      },
    },
    majors: {
      columns: {
        alias: funcs.valuesFromArray({ values: majors.map((m) => m.alias) }),
        name: funcs.valuesFromArray({ values: majors.map((m) => m.name) }),
      },
    },
    options: {
      columns: {
        alias: funcs.valuesFromArray({ values: options.map((o) => o.alias) }),
        name: funcs.valuesFromArray({ values: options.map((o) => o.name) }),
      },
    },
  }));
}

main();
