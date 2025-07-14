export const major2str = {
  Généraliste: "Généraliste",
  IR: "Informatique et Réseaux",
  "TI Santé": "Technologies de l'Information pour la Santé",
};

export const option2str = {
  SDIA: "Science des Données et Intelligence Artificielle",
  RIO: "Réseaux et Internet des Objets",
  TI: "Je sais pas",
  DTMI: "Aucune idée",
  AUCUNE: "Aucune",
};

// Mapping pour transformer les anciens alias du parsing Excel vers les nouveaux
export const excelToMajorAlias: Record<string, string> = {
  gene: "Généraliste",
  ir: "IR",
  "ti-sante": "TI Santé",
  généraliste: "Généraliste",
  "informatique et réseaux": "IR",
  "technologies de l'information pour la santé": "TI Santé",
};

export const excelToOptionAlias: Record<string, string> = {
  sdia: "SDIA",
  rio: "RIO",
  ti: "TI",
  dtmi: "DTMI",
  aucune: "AUCUNE",
  "science des données et intelligence artificielle": "SDIA",
  "réseaux et internet des objets": "RIO",
};
