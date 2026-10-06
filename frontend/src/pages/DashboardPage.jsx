import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

function DashboardPage() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold">
                    Dashboard
                </h1>

                <p className="text-muted-foreground">
                    IT Service Desk & Asset Management
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card>
                    <CardHeader>
                        <CardTitle>Total Tickets</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            0
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Open Tickets</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            0
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>In Progress</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            0
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>High Priority</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            0
                        </div>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}

export default DashboardPage;