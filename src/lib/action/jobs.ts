import type { Job } from "@/types/job";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Job data backend API-তে পাঠায় এবং server error-কে readable error হিসেবে ফেরায়।
export async function createjob(data: Job) {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? "Could not publish the job.");
  }

  return result as { id: string };
}
