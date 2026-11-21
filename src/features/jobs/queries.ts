const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function getJobs(query = '') {
  const response = await fetch(`${API_URL}/jobs?${query}`, {
    credentials: 'include',
  });
  return response.json();
}
