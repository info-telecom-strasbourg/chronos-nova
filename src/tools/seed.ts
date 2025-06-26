import { config } from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

config(); // charge .env

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// nombre d’éléments à générer
const N_ORG = 10;
const N_STUD = 30;
const N_INTERN = 20;
const N_COMPLETE = 50;

async function seedOrganizations() {
  const orgs = Array.from({ length: N_ORG }).map(() => ({
    organization_name: faker.company.name(),
    tutor_firstname: faker.person.firstName(),
    tutor_lastname: faker.person.lastName(),
    organization_type: faker.company.buzzPhrase(),
    organization_country: faker.location.country(),
    organization_city: faker.location.city(),
    organization_postal_code: Number(faker.location.zipCode()),
  }));

  const { data, error } = await supabase
    .from("Organization")
    .insert(orgs)
    .select("organization_id");
  if (error) throw error;
  return data!.map((o) => o.organization_id);
}

async function seedStudents(orgIds: number[]) {
  const studs = Array.from({ length: N_STUD }).map(() => ({
    student_lastname: faker.person.lastName(),
    student_firstname: faker.person.firstName(),
    student_degree: faker.helpers.arrayElement([
      "Généraliste",
      "IR",
      "TI Santé",
    ]),
    student_course: faker.lorem.word(),
    organization_id: faker.helpers.arrayElement(orgIds),
  }));
  const { data, error } = await supabase
    .from("Student")
    .insert(studs)
    .select("student_id");
  if (error) throw error;
  return data!.map((s) => s.student_id);
}

async function seedInternships() {
  const interns = Array.from({ length: N_INTERN }).map(() => ({
    internship_subject: faker.lorem.sentence(),
    internship_confidential: faker.datatype.boolean(),
    internship_dates: faker.date.past().toISOString(),
    internship_period: faker.number.int({ min: 4, max: 24 }),
    internship_year: faker.helpers.arrayElement(["1A", "2A", "3A"]),
  }));
  const { data, error } = await supabase
    .from("Internship")
    .insert(interns)
    .select("internship_id");
  if (error) throw error;
  return data!.map((i) => i.internship_id);
}

async function seedComplete(studentIds: number[], internshipIds: number[]) {
  const pairs = new Set<string>();
  const completes = [];
  while (completes.length < N_COMPLETE) {
    const s = faker.helpers.arrayElement(studentIds);
    const i = faker.helpers.arrayElement(internshipIds);
    const key = `${i}-${s}`;
    if (!pairs.has(key)) {
      pairs.add(key);
      completes.push({ internship_id: i, student_id: s });
    }
  }
  const { error } = await supabase.from("Complete").insert(completes);
  if (error) throw error;
}

async function main() {
  console.log("→ Création des organisations…");
  const orgIds = await seedOrganizations();
  console.log("→ Création des étudiants…");
  const studIds = await seedStudents(orgIds);
  console.log("→ Création des internships…");
  const internIds = await seedInternships();
  console.log(" → Création des liaisons Complete…");
  await seedComplete(studIds, internIds);
  console.log("✅ Seeding terminé !");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
