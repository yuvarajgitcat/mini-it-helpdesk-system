const BASE_URL = "http://localhost:5000/api";

export const getTickets = async () => {
    const response = await fetch(`${BASE_URL}/tickets`);

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    const data = await response.json();
    return data;
};