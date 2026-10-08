import { useEffect, useState } from "react";

import {
    getTickets,
    updateTicketStatus,
    getTicketEvidence,
    uploadTicketEvidence,
    getSimilarTickets
} from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    RefreshCw,
    Upload,
    Search,
    FileText,
    Paperclip,
    ExternalLink
} from "lucide-react";


function TicketsPage() {

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedTicket, setSelectedTicket] =
        useState(null);

    const [evidence, setEvidence] =
        useState([]);

    const [similarTickets, setSimilarTickets] =
        useState([]);

    const [loadingEvidence, setLoadingEvidence] =
        useState(false);

    const [loadingSimilar, setLoadingSimilar] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [uploadMessage, setUploadMessage] =
        useState("");


    const loadTickets = async () => {

        try {

            setLoading(true);

            const data =
                await getTickets();

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


    const openTicketTools = async (
        ticket
    ) => {

        setSelectedTicket(ticket);

        setEvidence([]);

        setSimilarTickets([]);

        setUploadMessage("");

        setLoadingEvidence(true);

        setLoadingSimilar(true);


        try {

            const evidenceData =
                await getTicketEvidence(
                    ticket.ticket_id
                );

            setEvidence(
                evidenceData
            );

        } catch (error) {

            console.error(
                "Evidence loading failed:",
                error
            );

        } finally {

            setLoadingEvidence(false);

        }


        try {

            const similarData =
                await getSimilarTickets(
                    ticket.ticket_id
                );

            setSimilarTickets(
                similarData.similar_tickets ||
                []
            );

        } catch (error) {

            console.error(
                "Similarity search failed:",
                error
            );

        } finally {

            setLoadingSimilar(false);

        }

    };


    const handleUpload = async (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file || !selectedTicket) {

            return;

        }


        setUploading(true);

        setUploadMessage("");


        try {

            await uploadTicketEvidence(
                selectedTicket.ticket_id,
                file
            );


            const updatedEvidence =
                await getTicketEvidence(
                    selectedTicket.ticket_id
                );


            setEvidence(
                updatedEvidence
            );


            setUploadMessage(
                "Evidence uploaded successfully."
            );


        } catch (error) {

            console.error(error);

            setUploadMessage(
                error.message ||
                "Evidence upload failed."
            );

        } finally {

            setUploading(false);

            event.target.value = "";

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
                        Manage incidents, evidence and historical correlations.
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


            {error && (

                <div className="rounded-md border px-4 py-3 text-sm">
                    {error}
                </div>

            )}


            <Card>

                <CardHeader>

                    <CardTitle>
                        Service Desk Incidents
                    </CardTitle>

                </CardHeader>


                <CardContent>

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

                                        <th className="px-3 py-3 text-left">
                                            Tools
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


                                                <td className="px-3 py-3">

                                                    <button
                                                        onClick={() =>
                                                            openTicketTools(
                                                                ticket
                                                            )
                                                        }
                                                        className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium hover:bg-muted"
                                                    >

                                                        <Paperclip className="mr-2 size-3.5" />

                                                        Evidence

                                                    </button>

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


            {selectedTicket && (

                <Card>

                    <CardHeader>

                        <div className="flex items-start justify-between">

                            <div>

                                <CardTitle>

                                    Ticket #{selectedTicket.ticket_id}

                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">

                                    {selectedTicket.title}

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setSelectedTicket(null)
                                }
                                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                            >
                                Close
                            </button>

                        </div>

                    </CardHeader>


                    <CardContent>

                        <div className="grid gap-6 lg:grid-cols-2">


                            {/* =================================================
                                EVIDENCE
                            ================================================= */}

                            <div className="space-y-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h3 className="font-semibold">
                                            Evidence
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Screenshots, logs and documents.
                                        </p>

                                    </div>


                                    <label className="inline-flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">

                                        <Upload className="mr-2 size-4" />

                                        {uploading
                                            ? "Uploading..."
                                            : "Upload"
                                        }

                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.webp,.txt,.pdf"
                                            className="hidden"
                                            disabled={uploading}
                                            onChange={
                                                handleUpload
                                            }
                                        />

                                    </label>

                                </div>


                                <div className="rounded-lg border">

                                    {loadingEvidence ? (

                                        <div className="p-6 text-center text-sm text-muted-foreground">
                                            Loading evidence...
                                        </div>

                                    ) : evidence.length === 0 ? (

                                        <div className="p-6 text-center text-sm text-muted-foreground">
                                            No evidence attached to this ticket.
                                        </div>

                                    ) : (

                                        // <div className="divide-y">

                                        //     {evidence.map(
                                        //         (item) => (

                                        //             <div
                                        //                 key={
                                        //                     item.evidence_id
                                        //                 }
                                        //                 className="flex items-center justify-between gap-4 p-4"
                                        //             >

                                        //                 <div className="flex min-w-0 items-center gap-3">

                                        //                     <FileText className="size-4 shrink-0" />

                                        //                     <div className="min-w-0">

                                        //                         <p className="truncate text-sm font-medium">
                                        //                             {
                                        //                                 item.original_filename
                                        //                             }
                                        //                         </p>

                                        //                         <p className="text-xs text-muted-foreground">

                                        //                             {
                                        //                                 Math.round(
                                        //                                     item.file_size_bytes /
                                        //                                     1024
                                        //                                 )
                                        //                             }
                                        //                             KB
                                        //                             {" · "}
                                        //                             {
                                        //                                 item.mime_type
                                        //                             }

                                        //                         </p>

                                        //                     </div>

                                        //                 </div>


                                        //                 <span className="shrink-0 text-xs text-muted-foreground">

                                        //                     SHA-256

                                        //                 </span>

                                        //             </div>

                                        //         )
                                        //     )}

                                        // </div>
                                        <div className="divide-y">

    {evidence.map((item) => {

        const isImage =
            item.mime_type?.startsWith("image/");

        const fileUrl =
            `http://localhost:5000${item.file_url}`;

        return (
            <div
                key={item.evidence_id}
                className="flex items-center justify-between gap-4 p-3"
            >

                <div className="flex min-w-0 items-center gap-3">

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={item.original_filename}
                            className="size-12 rounded-md border object-cover"
                        />
                    ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border bg-muted">
                            <FileText className="size-5" />
                        </div>
                    )}

                    <div className="min-w-0">

                        <p className="truncate text-sm font-medium">
                            {item.original_filename}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {Math.round(
                                item.file_size_bytes / 1024
                            )} KB
                        </p>

                    </div>

                </div>


                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >

                    <ExternalLink className="size-3.5" />

                    {isImage ? "View" : "Open"}

                </a>

            </div>
        );

    })}

</div>
                                    )}

                                </div>


                                {uploadMessage && (

                                    <div className="rounded-md border px-3 py-2 text-sm">
                                        {uploadMessage}
                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                INCIDENT CORRELATION
                            ================================================= */}

                            <div className="space-y-4">

                                <div>

                                    <h3 className="font-semibold">
                                        Similar Incidents
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Historical tickets matched using PostgreSQL similarity.
                                    </p>

                                </div>


                                <div className="rounded-lg border">

                                    {loadingSimilar ? (

                                        <div className="p-6 text-center text-sm text-muted-foreground">
                                            Searching historical incidents...
                                        </div>

                                    ) : similarTickets.length === 0 ? (

                                        <div className="p-6 text-center text-sm text-muted-foreground">
                                            No sufficiently similar incidents found.
                                        </div>

                                    ) : (

                                        <div className="divide-y">

                                            {similarTickets.map(
                                                (similar) => (

                                                    <div
                                                        key={
                                                            similar.ticket_id
                                                        }
                                                        className="p-4"
                                                    >

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div>

                                                                <p className="text-sm font-medium">

                                                                    #{similar.ticket_id}
                                                                    {" — "}
                                                                    {similar.title}

                                                                </p>

                                                                <p className="mt-1 text-xs text-muted-foreground">

                                                                    {
                                                                        similar.employee_name
                                                                    }

                                                                    {" · "}

                                                                    {
                                                                        similar.asset_tag ||
                                                                        "No asset"
                                                                    }

                                                                </p>

                                                            </div>


                                                            <Badge variant="secondary">

                                                                {
                                                                    similar.similarity_score
                                                                }

                                                            </Badge>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>


                                <div className="rounded-lg bg-muted p-4">

                                    <div className="flex gap-3">

                                        <Search className="mt-0.5 size-4 shrink-0" />

                                        <p className="text-xs leading-5 text-muted-foreground">

                                            Similarity combines incident
                                            title, description and asset
                                            relationships. The matching is
                                            performed by PostgreSQL rather
                                            than by React.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </CardContent>

                </Card>

            )}

        </div>

    );

}


export default TicketsPage;