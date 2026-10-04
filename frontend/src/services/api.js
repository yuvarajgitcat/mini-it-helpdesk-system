const BASE_URL = "http://localhost:5000/api";

export const getTickets = async () => {
    const response = await fetch(`${BASE_URL}/tickets`);

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    const data = await response.json();
    return data;
};

export async function updateTicketStatus(ticketId, newStatus) {
    const response = await fetch(
        `${BASE_URL}/tickets/${ticketId}/status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: newStatus,
                changed_by: 1
            })
        }
    );

    if (!response.ok) {
        throw new Error("Unable to update ticket");
    }

    return response.json();
}


export async function getEmployees() {
    const response = await fetch(`${BASE_URL}/employees`);

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return response.json();
}

export async function getAssets() {
    const response = await fetch(`${BASE_URL}/assets`);

    if (!response.ok) {
        throw new Error("Failed to fetch assets");
    }

    return response.json();
}

export async function createTicket(ticketData) {
    const response = await fetch(`${BASE_URL}/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
        throw new Error("Failed to create ticket");
    }

    return response.json();
}