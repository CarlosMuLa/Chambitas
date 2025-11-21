import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

// DATOS DE TU CONFIGURACIÓN (Pone estos en tu .env o config)
const IDENTITY_POOL_ID = process.env.PUBLIC_EXPO_GUESS_IDENTITY_POOL_ID || ''; // Tu Identity Pool ID
const BUCKET_NAME = "chambitas-uploads";
const AWS_REGION = process.env.PUBLIC_EXPO_AWS_REGION || '';

// 1. Configurar el Cliente S3 con credenciales de Cognito
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: AWS_REGION },
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

export const uploadProfilePicture = async (uri: string, userId: string) => {
  try {
    // 2. Convertir la URI de la imagen a Blob (Binary Large Object)
    const response = await fetch(uri);
    const blob = await response.blob();

    // 3. Definir la ruta del archivo (Key)
    // Es buena práctica ponerlas en una carpeta, ej: "profiles/"
    const fileName = `profiles-photos/${userId}.jpg`;

    // 4. Crear el comando de subida
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: blob,
      ContentType: "image/jpeg", // Asumiendo que es jpg
    });

    // 5. Enviar a S3
    await s3Client.send(command);

    // 6. Construir la URL pública (para guardarla en Cognito después)
    // Nota: Esto asume que tu bucket permite lectura pública o usarás CloudFront.
    const publicUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
    
    return publicUrl;

  } catch (error) {
    console.error("Error subiendo imagen a S3:", error);
    throw error;
  }
};