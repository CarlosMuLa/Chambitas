import { createConnection } from 'mysql2/promise';

export const handler = async (event) => {
  let connection;
  try {
    console.log("Evento recibido:", JSON.stringify(event, null, 2));

    // --- CORRECCIÓN AQUÍ ---
    // Intentamos obtener offer_id de los parámetros de la URL (GET) o del Body (POST)
    let offer_id;
    
    if (event.queryStringParameters && event.queryStringParameters.offer_id) {
      offer_id = event.queryStringParameters.offer_id;
    } else if (event.body) {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      offer_id = body.offer_id;
    }
    // -----------------------

    if (!offer_id) {
      throw new Error("Falta el ID de la oferta (offer_id)");
    }

    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const sql = `
      SELECT AVG(r.rating) AS avg_rating
      FROM offers o
      JOIN orders ord ON o.offer_id = ord.offer_id
      JOIN reviews r ON ord.order_id = r.order_id
      WHERE o.offer_id = ?
    `;

    const [rows] = await connection.execute(sql, [offer_id]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ 
        offer_id,
        avg_rating: rows[0]?.avg_rating || 0 // Retorna 0 si es null
      })
    };

  } catch (error) {
    console.error("Error obteniendo promedio de rating:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Error al obtener promedio de rating", details: error.message })
    };
  } finally {
    if (connection) await connection.end();
  }
};