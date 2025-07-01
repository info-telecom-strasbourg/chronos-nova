import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, sql } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '@/backend/src/db/schema';

const sqlite = new Database('./backend/drizzle/data.db');
const db = drizzle(sqlite, { schema });

console.log('🔄 Mise à jour des types d\'organisation dans la base de données\n');

try {
  // Vérifier les valeurs actuelles
  const currentTypes = sqlite.prepare(`
    SELECT organization_type, COUNT(*) as count 
    FROM organization 
    GROUP BY organization_type
  `).all();
  
  console.log('📊 Types d\'organisation actuels :');
  console.table(currentTypes);
  
  // Mettre à jour E → Entreprise
  const updateE = sqlite.prepare(`
    UPDATE organization 
    SET organization_type = 'Entreprise' 
    WHERE organization_type = 'E'
  `);
  
  const resultE = updateE.run();
  console.log(`✅ Mis à jour ${resultE.changes} organisations de "E" vers "Entreprise"`);
  
  // Mettre à jour L → Hors entreprise
  const updateL = sqlite.prepare(`
    UPDATE organization 
    SET organization_type = 'Hors entreprise' 
    WHERE organization_type = 'L'
  `);
  
  const resultL = updateL.run();
  console.log(`✅ Mis à jour ${resultL.changes} organisations de "L" vers "Hors entreprise"`);
  
  // Vérifier les nouvelles valeurs
  const newTypes = sqlite.prepare(`
    SELECT organization_type, COUNT(*) as count 
    FROM organization 
    GROUP BY organization_type
  `).all();
  
  console.log('\n📊 Types d\'organisation après mise à jour :');
  console.table(newTypes);
  
} catch (error) {
  console.error('❌ Erreur lors de la mise à jour :', error);
} finally {
  sqlite.close();
}
