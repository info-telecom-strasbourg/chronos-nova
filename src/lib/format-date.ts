export function formatDate(dateStr: string) {
  // Gestion des différents formats de date
  let date: Date;
  
  // Si c'est au format français dd/MM/yyyy (de la base de données)
  if (dateStr.includes('/') && dateStr.split('/').length === 3) {
    const [day, month, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day); // month - 1 car les mois sont indexés à partir de 0
  }
  // Si c'est au format ISO ou autre format standard
  else {
    date = new Date(dateStr);
  }
  
  // Vérification que la date est valide
  if (isNaN(date.getTime())) {
    console.warn(`Date invalide: ${dateStr}`);
    return dateStr; // Retourne la chaîne originale si elle ne peut pas être parsée
  }
  
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long", 
    year: "numeric",
  });
}
