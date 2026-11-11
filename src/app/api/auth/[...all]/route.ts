import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth-এর GET ও POST endpoint-কে Next.js App Router-এর সাথে যুক্ত করে।
export const { GET, POST } = toNextJsHandler(auth);
