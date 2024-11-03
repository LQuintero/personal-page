import dotenv from 'dotenv';
import { emit } from 'process';

dotenv.config();

const envVariables = {
    email: {
        emailSvcId: process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
        emailTemplateId: process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
        emailUserId: process.env.NEXT_PUBLIC_EMAIL_USER_ID
    }
};

// Recursive function to check for missing environment variables
function validateEnvVars(obj: Record<string, any>, path = ''): void {
    for (const key in obj) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      if (value && typeof value === 'object') {
        // Recurse into nested objects
        validateEnvVars(value, fullPath);
      } else if (!value) {
        console.error(`Missing environment variable: ${fullPath}`);
      }
    }
  }

  validateEnvVars(envVariables);

// Export the validated configuration
export const config = envVariables;