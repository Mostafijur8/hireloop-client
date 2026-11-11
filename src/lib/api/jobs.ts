const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";


export const jobs = async () => {
    const response = await fetch(`${API_URL}/jobs`);
   return response.json();
};

export default jobs;