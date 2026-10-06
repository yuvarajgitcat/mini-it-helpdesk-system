const BASE_URL = "http://localhost:5000/api";


// =========================================================
// TICKETS
// =========================================================

export async function getTickets() {
    const response = await fetch(
        `${BASE_URL}/tickets`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    return response.json();
}


export async function getTicket(ticketId) {
    const response = await fetch(
        `${BASE_URL}/tickets/${ticketId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch ticket");
    }

    return response.json();
}


export async function getTicketHistory(ticketId) {
    const response = await fetch(
        `${BASE_URL}/tickets/${ticketId}/history`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch ticket history");
    }

    return response.json();
}


export async function getTicketStatistics() {
    const response = await fetch(
        `${BASE_URL}/tickets/statistics`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch ticket statistics"
        );
    }

    return response.json();
}


export async function createTicket(ticketData) {
    const response = await fetch(
        `${BASE_URL}/tickets`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(ticketData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create ticket");
    }

    return response.json();
}


export async function updateTicketStatus(
    ticketId,
    newStatus
) {
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
        throw new Error(
            "Unable to update ticket"
        );
    }

    return response.json();
}


// =========================================================
// EMPLOYEES
// =========================================================

export async function getEmployees() {
    const response = await fetch(
        `${BASE_URL}/employees`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch employees"
        );
    }

    return response.json();
}


export async function getEmployeeTickets(
    employeeId
) {
    const response = await fetch(
        `${BASE_URL}/employees/${employeeId}/tickets`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch employee tickets"
        );
    }

    return response.json();
}


// =========================================================
// ASSETS
// =========================================================

export async function getAssets() {
    const response = await fetch(
        `${BASE_URL}/assets`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch assets"
        );
    }

    return response.json();
}


export async function getAssetTickets(
    assetId
) {
    const response = await fetch(
        `${BASE_URL}/assets/${assetId}/tickets`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch asset tickets"
        );
    }

    return response.json();
}