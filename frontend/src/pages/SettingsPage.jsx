import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Settings } from "lucide-react";


function SettingsPage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Settings
                </h1>

                <p className="text-muted-foreground">
                    Application configuration and operational rules.
                </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2">


                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <Settings className="size-5" />

                            Ticket Configuration

                        </CardTitle>

                    </CardHeader>


                    <CardContent className="space-y-4 text-sm">

                        <div className="flex justify-between border-b pb-3">

                            <span className="text-muted-foreground">
                                Default priority
                            </span>

                            <span className="font-medium">
                                MEDIUM
                            </span>

                        </div>


                        <div className="flex justify-between border-b pb-3">

                            <span className="text-muted-foreground">
                                Allowed priorities
                            </span>

                            <span className="font-medium">
                                LOW / MEDIUM / HIGH
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-muted-foreground">
                                Allowed statuses
                            </span>

                            <span className="font-medium">
                                4 states
                            </span>

                        </div>

                    </CardContent>

                </Card>


                <Card>

                    <CardHeader>

                        <CardTitle>
                            Evidence Configuration
                        </CardTitle>

                    </CardHeader>


                    <CardContent className="space-y-4 text-sm">

                        <div className="flex justify-between border-b pb-3">

                            <span className="text-muted-foreground">
                                Maximum file size
                            </span>

                            <span className="font-medium">
                                10 MB
                            </span>

                        </div>


                        <div className="flex justify-between border-b pb-3">

                            <span className="text-muted-foreground">
                                Supported files
                            </span>

                            <span className="font-medium">
                                PNG / JPEG / WEBP
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-muted-foreground">
                                Duplicate detection
                            </span>

                            <span className="font-medium">
                                SHA-256
                            </span>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>

    );

}


export default SettingsPage;