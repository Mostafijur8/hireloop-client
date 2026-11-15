const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const Getjobs = async (query = '') => {
  const response = await fetch(`${API_URL}/jobs?${query}`);
  return response.json();
};

export default Getjobs;
