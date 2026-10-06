import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    CircleHelp,
    Database,
    FileSearch,
    History,
    Search
} from "lucide-react";


const helpItems = [
    {
        title: "Creating a ticket",
        description:
            "Use Quick Create to associate an incident with an employee and, when applicable, an affected asset."
    },
    {
        title: "Ticket lifecycle",
        description:
            "Tickets move through OPEN, IN_PROGRESS, RESOLVED and CLOSED states. Status changes are recorded in ticket history."
    },
    {
        title: "Evidence",
        description:
            "Screenshots, logs and documents can be attached to an incident. The system records file metadata and detects duplicate evidence."
    },
    {
        title: "Incident correlation",
        description:
            "Historical tickets can be compared using PostgreSQL text similarity together with asset relationships."
    },
    {
        title: "Database architecture",
        description:
            "Employees, assets, tickets, ticket history and evidence are connected through relational constraints and indexed queries."
    }
];


function HelpPage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Get Help
                </h1>

                <p className="text-muted-foreground">
                    Learn how the IT Helpdesk platform works.
                </p>

            </div>


            <div className="grid gap-4">

                {helpItems.map(
                    (item, index) => (

                        <Card key={item.title}>

                            <CardHeader>

                                <CardTitle className="flex items-center gap-3">

                                    {index === 0 && (
                                        <CircleHelp className="size-5" />
                                    )}

                                    {index === 1 && (
                                        <History className="size-5" />
                                    )}

                                    {index === 2 && (
                                        <FileSearch className="size-5" />
                                    )}

                                    {index === 3 && (
                                        <Search className="size-5" />
                                    )}

                                    {index === 4 && (
                                        <Database className="size-5" />
                                    )}

                                    {item.title}

                                </CardTitle>

                            </CardHeader>


                            <CardContent>

                                <p className="text-sm leading-6 text-muted-foreground">
                                    {item.description}
                                </p>

                            </CardContent>

                        </Card>

                    )
                )}

            </div>

        </div>

    );

}


export default HelpPage;