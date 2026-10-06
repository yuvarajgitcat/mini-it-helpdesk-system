import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Database,
    ShieldCheck,
    GitBranch,
    Search,
    FileSearch
} from "lucide-react";


const features = [
    {
        title: "Incident Correlation",
        description:
            "Find historically similar incidents using PostgreSQL text similarity and asset relationships.",
        icon: Search
    },
    {
        title: "Evidence Management",
        description:
            "Attach screenshots, logs and documents to incidents with database-backed metadata and duplicate detection.",
        icon: FileSearch
    },
    {
        title: "Audit History",
        description:
            "Track ticket status transitions and the employee responsible for each change.",
        icon: GitBranch
    },
    {
        title: "Database Integrity",
        description:
            "Foreign keys, constraints, indexes and transactional updates protect operational data.",
        icon: ShieldCheck
    },
    {
        title: "PostgreSQL Core",
        description:
            "The application uses relational joins, aggregation, transactions and database-side reporting.",
        icon: Database
    }
];


function MorePage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    More
                </h1>

                <p className="text-muted-foreground">
                    Advanced capabilities of the helpdesk platform.
                </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2">

                {features.map(
                    (feature) => {

                        const Icon =
                            feature.icon;

                        return (

                            <Card
                                key={
                                    feature.title
                                }
                            >

                                <CardHeader>

                                    <CardTitle className="flex items-center gap-3">

                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">

                                            <Icon className="size-4" />

                                        </div>

                                        {feature.title}

                                    </CardTitle>

                                </CardHeader>


                                <CardContent>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </p>

                                </CardContent>

                            </Card>

                        );

                    }
                )}

            </div>

        </div>

    );

}


export default MorePage;