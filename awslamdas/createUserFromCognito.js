// 1. Usamos IMPORT en lugar de require
import { createConnection } from 'mysql2/promise';

// 2. Usamos EXPORT CONST en lugar de exports.handler
export const handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event, null, 2));

  const attrs = event.request.userAttributes;
  
  const sub = attrs.sub;
  const email = attrs.email;
  const phone = attrs.phone_number;
  const address = attrs.address;    
  const userType = attrs['custom:type'];
  const picture = attrs.picture || attrs['custom:photo'];
  const city = attrs['custom:city'] || null; 
  const username = event.userName;

  let connection;

  try {
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // ssl: { rejectUnauthorized: false } 
    });

    const query = `
      INSERT IGNORE INTO users 
      (cognito_sub, email, username, phone, address_1, type_id, city_id, photo, status_id, created_at)
      VALUES (?,      ?,       ?,      ?,      ?,         ?,        ?,     ?,       1,        NOW())
    `;

    const values = [sub, email, username, phone, address, userType, city, picture];

    await connection.execute(query, values);
    console.log(`Usuario ${sub} guardado en MySQL.`);

  } catch (err) {
    console.error("ERROR CRÍTICO DB:", err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  return event;
};