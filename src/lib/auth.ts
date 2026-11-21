import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { admin } from 'better-auth/plugins';

// MongoDB connection ও Better Auth-এর server-side configuration।
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('hireloopDB');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  // Use MongoDB-backed limits so counters are shared across app instances.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: 'database',
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['seeker', 'recruiter', 'admin'],
        defaultValue: 'seeker',
        // Roles are assigned by trusted server/admin actions, never signup input.
        input: false,
      },
    },
  },
  plugins: [admin()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
