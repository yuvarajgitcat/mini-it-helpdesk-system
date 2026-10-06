import { useEffect, useState } from "react";

import { getTicketStatistics } from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { BarChart3 } from "lucide-react";


function ReportsPage() {

    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadReport = async () => {

            try {

                const data =
                    await getTicketStatistics();

                setStatistics(
                    data.summary
                );

            } catch (error) {

                console.error(
                    "Unable to load report:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadReport();

    }, []);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Reports
                </h1>

                <p className="text-muted-foreground">
                    Database-driven service desk reporting.
                </p>

            </div>


            {loading ? (

                <div className="py-10 text-center text-sm text-muted-foreground">
                    Generating report...
                </div>

            ) : statistics ? (

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <BarChart3 className="size-5" />

                                Total Tickets

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.total_tickets}
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Open
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.open_tickets}
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle>
                                In Progress
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.in_progress_tickets}
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Resolved
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.resolved_tickets}
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Closed
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.closed_tickets}
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle>
                                High Priority
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {statistics.high_priority_tickets}
                            </p>

                        </CardContent>

                    </Card>

                </div>

            ) : (

                <Card>

                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        Report data is unavailable.
                    </CardContent>

                </Card>

            )}

        </div>

    );

}


export default ReportsPage;