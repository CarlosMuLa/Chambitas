import mysql from "mysql2/promise";

export const handler = async (event) => {
    let conn;
    try {
        // 1. Parseo seguro del body
        // Si event.body ya es objeto (pasa a veces en pruebas), no lo parseamos.
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        
        console.log("Datos recibidos:", body);
        
        const { sub, price, serviceType, title, thumbnail, image1, image2, city, duration, description } = body;

        // 2. Conexión a BD
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // 3. Query CORREGIDA (Sin la coma extra)
        // Nota: 'status' lo sacaste del body pero no lo usaste en la query. 
        // Si lo necesitas, agrégalo. Si no, bórralo del destructuring.
        const sql = `
            INSERT INTO offers 
            (cognito_sub, service_type_id, price, title, thumbnail, image1, image2, city_id, time_unit, description, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [sub, serviceType, price, title, thumbnail, image1, image2, city, duration, description];

        await conn.execute(sql, values);

        return {
            statusCode: 201,
            // Headers CORS para que no te falle desde el navegador/celular
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ message: "Post creado exitosamente" })
        };

    } catch (error) {
        console.error("Error Lambda:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: "Error al crear el post", details: error.message })
        };
    } finally {
        // 4. Cierre seguro de conexión (siempre)
        if (conn) await conn.end();
    }
};