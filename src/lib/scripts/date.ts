export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // // Si la date contient un séparateur (ex: "01/09/2024 - 31/01/2025"), on prend seulement la première partie
  // let startDateStr = dateStr;
  // if (dateStr.includes(" - ")) {
  //   startDateStr = dateStr.split(" - ")[0];
  // }

  // // Gestion des différents formats de date
  // let date: Date;

  // // Si c'est au format français dd/MM/yyyy (de la base de données)
  // if (startDateStr.includes("/") && startDateStr.split("/").length === 3) {
  //   const [day, month, year] = startDateStr.split("/").map(Number);
  //   date = new Date(year, month - 1, day); // month - 1 car les mois sont indexés à partir de 0
  // }
  // // Si c'est au format ISO ou autre format standard
  // else {
  //   date = new Date(startDateStr);
  // }

  // // Vérification que la date est valide
  // if (Number.isNaN(date.getTime())) {
  //   console.warn(`Date invalide: ${startDateStr}`);
  //   return startDateStr; // Retourne la chaîne originale si elle ne peut pas être parsée
  // }

  // return date.toLocaleDateString("fr-FR", {
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });
}
