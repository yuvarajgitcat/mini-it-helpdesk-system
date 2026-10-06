import { useEffect, useState } from "react";

import {
    getTickets,
    updateTicketStatus
} from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { RefreshCw } from "lucide-react";


function TicketsPage() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadTickets = async () => {

        try {

            setLoading(true);

            const data = await getTickets();

            setTickets(data);
            setError("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load tickets."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadTickets();

    }, []);


    const handleStatusChange = async (
        ticketId,
        status
    ) => {

        try {

            await updateTicketStatus(
                ticketId,
                status
            );

            await loadTickets();

        } catch (error) {

            console.error(error);

            setError(
                "Unable to update ticket status."
            );

        }

    };


    return (

        <div className="space-y-6">

            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Tickets
                    </h1>

                    <p className="text-muted-foreground">
                        Manage and track service incidents.
                    </p>

                </div>


                <button
                    onClick={loadTickets}
                    className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted"
                >

                    <RefreshCw className="mr-2 size-4" />

                    Refresh

                </button>

            </div>


            <Card>

                <CardHeader>

                    <CardTitle>
                        Service Desk Incidents
                    </CardTitle>

                </CardHeader>


                <CardContent>

                    {error && (

                        <div className="mb-4 rounded-md border px-4 py-3 text-sm">
                            {error}
                        </div>

                    )}


                    {loading ? (

                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Loading tickets...
                        </div>

                    ) : tickets.length === 0 ? (

                        <div className="py-10 text-center text-sm text-muted-foreground">
                            No tickets found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="border-b">

                                    <tr>

                                        <th className="px-3 py-3 text-left">
                                            ID
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Title
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Employee
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Asset
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Priority
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {tickets.map(
                                        (ticket) => (

                                            <tr
                                                key={
                                                    ticket.ticket_id
                                                }
                                                className="border-b last:border-0"
                                            >

                                                <td className="px-3 py-3 font-medium">
                                                    #{ticket.ticket_id}
                                                </td>


                                                <td className="px-3 py-3">
                                                    {ticket.title}
                                                </td>


                                                <td className="px-3 py-3">
                                                    {ticket.employee_name}
                                                </td>


                                                <td className="px-3 py-3 text-muted-foreground">
                                                    {ticket.asset_tag || "—"}
                                                </td>


                                                <td className="px-3 py-3">

                                                    <Badge variant="outline">
                                                        {ticket.priority}
                                                    </Badge>

                                                </td>


                                                <td className="px-3 py-3">

                                                    <select
                                                        value={
                                                            ticket.status
                                                        }
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                ticket.ticket_id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-8 rounded-md border bg-background px-2 text-xs"
                                                    >

                                                        <option value="OPEN">
                                                            OPEN
                                                        </option>

                                                        <option value="IN_PROGRESS">
                                                            IN PROGRESS
                                                        </option>

                                                        <option value="RESOLVED">
                                                            RESOLVED
                                                        </option>

                                                        <option value="CLOSED">
                                                            CLOSED
                                                        </option>

                                                    </select>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </CardContent>

            </Card>

        </div>

    );

}


export default TicketsPage;