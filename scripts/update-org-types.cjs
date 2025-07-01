const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./backend/drizzle/data.db');

console.log('🔄 Mise à jour des types d\'organisation dans la base de données\n');

// Vérifier les valeurs actuelles
db.all(`
  SELECT organization_type, COUNT(*) as count 
  FROM organization 
  GROUP BY organization_type
`, (err, currentTypes) => {
  if (err) {
    console.error('❌ Erreur lors de la lecture :', err);
    return;
  }
  
  console.log('📊 Types d\'organisation actuels :');
  console.table(currentTypes);
  
  // Mettre à jour E → Entreprise
  db.run(`
    UPDATE organization 
    SET organization_type = 'Entreprise' 
    WHERE organization_type = 'E'
  `, function(err) {
    if (err) {
      console.error('❌ Erreur mise à jour E :', err);
      return;
    }
    console.log(`✅ Mis à jour ${this.changes} organisations de "E" vers "Entreprise"`);
    
    // Mettre à jour L → Hors entreprise
    db.run(`
      UPDATE organization 
      SET organization_type = 'Hors entreprise' 
      WHERE organization_type = 'L'
    `, function(err) {
      if (err) {
        console.error('❌ Erreur mise à jour L :', err);
        return;
      }
      console.log(`✅ Mis à jour ${this.changes} organisations de "L" vers "Hors entreprise"`);
      
      // Vérifier les nouvelles valeurs
      db.all(`
        SELECT organization_type, COUNT(*) as count 
        FROM organization 
        GROUP BY organization_type
      `, (err, newTypes) => {
        if (err) {
          console.error('❌ Erreur lors de la vérification :', err);
          return;
        }
        
        console.log('\n📊 Types d\'organisation après mise à jour :');
        console.table(newTypes);
        
        db.close();
      });
    });
  });
});
