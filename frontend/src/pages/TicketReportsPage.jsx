import { useEffect, useState } from "react";

import { getTickets } from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { FileText } from "lucide-react";


function TicketReportsPage() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadTickets = async () => {

            try {

                const data =
                    await getTickets();

                setTickets(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadTickets();

    }, []);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Ticket Reports
                </h1>

                <p className="text-muted-foreground">
                    Detailed operational view of recorded incidents.
                </p>

            </div>


            <Card>

                <CardHeader>

                    <CardTitle className="flex items-center gap-2">

                        <FileText className="size-5" />

                        Ticket Register

                    </CardTitle>

                </CardHeader>


                <CardContent>

                    {loading ? (

                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Preparing report...
                        </p>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="border-b">

                                    <tr>

                                        <th className="px-3 py-3 text-left">
                                            Ticket
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Issue
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

                                                <td className="px-3 py-3">
                                                    {ticket.asset_tag || "—"}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {ticket.priority}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {ticket.status}
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


export default TicketReportsPage;