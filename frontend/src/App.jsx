import { useEffect, useState } from "react";

import {
    getTickets,
    updateTicketStatus,
    getEmployees,
    getAssets,
    createTicket,
    getTicketStatistics
} from "./services/api";

import CreateTicketForm from "./components/tickets/CreateTicketForm";

import DashboardPage from "./pages/DashboardPage";
import QuickCreatePage from "./pages/QuickCreatePage";
import TicketsPage from "./pages/TicketsPage";
import EmployeesPage from "./pages/EmployeesPage";
import AssetsPage from "./pages/AssetsPage";
import ReportsPage from "./pages/ReportsPage";
import TicketReportsPage from "./pages/TicketReportsPage";
import MorePage from "./pages/MorePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";


function App() {

    // =====================================================
    // APPLICATION DATA
    // =====================================================

    const [tickets, setTickets] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [assets, setAssets] = useState([]);

    const [statistics, setStatistics] = useState({
        total_tickets: 0,
        open_tickets: 0,
        in_progress_tickets: 0,
        resolved_tickets: 0,
        closed_tickets: 0,
        high_priority_tickets: 0
    });


    // =====================================================
    // CREATE TICKET FORM
    // =====================================================

    const [form, setForm] = useState({
        employee_id: "",
        asset_id: "",
        title: "",
        description: "",
        priority: "MEDIUM"
    });


    // =====================================================
    // CURRENT PAGE
    // =====================================================

    const [page, setPage] = useState(
        window.location.hash.replace("#", "")
        || "dashboard"
    );


    // =====================================================
    // SIDEBAR / HASH NAVIGATION
    // =====================================================

    useEffect(() => {

        const handleHashChange = () => {

            const currentPage =
                window.location.hash.replace("#", "")
                || "dashboard";

            setPage(currentPage);
        };


        window.addEventListener(
            "hashchange",
            handleHashChange
        );


        return () => {

            window.removeEventListener(
                "hashchange",
                handleHashChange
            );

        };

    }, []);


    // =====================================================
    // LOAD DATABASE DATA
    // =====================================================

    const loadDashboardData = async () => {

        try {

            const [
                ticketData,
                employeeData,
                assetData,
                statisticsData
            ] = await Promise.all([

                getTickets(),

                getEmployees(),

                getAssets(),

                getTicketStatistics()

            ]);


            setTickets(ticketData);

            setEmployees(employeeData);

            setAssets(assetData);

            setStatistics(
                statisticsData.summary
            );


        } catch (error) {

            console.error(
                "Error loading dashboard:",
                error
            );

        }

    };


    useEffect(() => {

        loadDashboardData();

    }, []);


    // =====================================================
    // CREATE TICKET
    // =====================================================

    const handleCreateTicket = async (e) => {

        e.preventDefault();

        try {

            await createTicket({

                employee_id:
                    Number(form.employee_id),

                asset_id:
                    form.asset_id
                        ? Number(form.asset_id)
                        : null,

                title:
                    form.title,

                description:
                    form.description,

                priority:
                    form.priority

            });


            setForm({

                employee_id: "",

                asset_id: "",

                title: "",

                description: "",

                priority: "MEDIUM"

            });


            await loadDashboardData();


        } catch (error) {

            console.error(
                "Error creating ticket:",
                error
            );

        }

    };


    // =====================================================
    // UPDATE TICKET STATUS
    // =====================================================

    const handleStatusChange = async (
        ticketId,
        newStatus
    ) => {

        try {

            await updateTicketStatus(
                ticketId,
                newStatus
            );


            await loadDashboardData();


        } catch (error) {

            console.error(
                "Error updating ticket:",
                error
            );

        }

    };


    // =====================================================
    // DASHBOARD
    // =====================================================

    const renderDashboard = () => {

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


                {/* =================================================
                    DATABASE-POWERED STATISTICS
                ================================================= */}

                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">

                    <Card>

                        <CardHeader>

                            <CardTitle className="text-sm">
                                Total Tickets
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="text-3xl font-bold">

                                {statistics.total_tickets}

                            </div>

                            <p className="text-xs text-muted-foreground">

                                From PostgreSQL COUNT(*)

                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle className="text-sm">
                                Open Tickets
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="text-3xl font-bold">

                                {statistics.open_tickets}

                            </div>

                            <p className="text-xs text-muted-foreground">

                                Database status aggregation

                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle className="text-sm">
                                In Progress
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="text-3xl font-bold">

                                {statistics.in_progress_tickets}

                            </div>

                            <p className="text-xs text-muted-foreground">

                                Database status aggregation

                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardHeader>

                            <CardTitle className="text-sm">
                                High Priority
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="text-3xl font-bold">

                                {statistics.high_priority_tickets}

                            </div>

                            <p className="text-xs text-muted-foreground">

                                PostgreSQL FILTER

                            </p>

                        </CardContent>

                    </Card>

                </div>


                {/* =================================================
                    CREATE TICKET
                ================================================= */}

                <CreateTicketForm

                    employees={employees}

                    assets={assets}

                    form={form}

                    setForm={setForm}

                    onSubmit={handleCreateTicket}

                />


                {/* =================================================
                    TICKETS
                ================================================= */}

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Tickets
                        </CardTitle>

                    </CardHeader>


                    <CardContent>

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-sm">
                                            ID
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm">
                                            Title
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm">
                                            Employee
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm">
                                            Asset
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm">
                                            Priority
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm">
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
                                                className="border-b"
                                            >

                                                <td className="px-4 py-3">

                                                    {ticket.ticket_id}

                                                </td>


                                                <td className="px-4 py-3">

                                                    {ticket.title}

                                                </td>


                                                <td className="px-4 py-3">

                                                    {
                                                        ticket.employee_name
                                                    }

                                                </td>


                                                <td className="px-4 py-3">

                                                    {
                                                        ticket.asset_tag
                                                        ||
                                                        "No asset"
                                                    }

                                                </td>


                                                <td className="px-4 py-3">

                                                    <Badge variant="outline">

                                                        {
                                                            ticket.priority
                                                        }

                                                    </Badge>

                                                </td>


                                                <td className="px-4 py-3">

                                                    <select

                                                        value={
                                                            ticket.status
                                                        }

                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleStatusChange(
                                                                ticket.ticket_id,
                                                                e.target.value
                                                            )
                                                        }

                                                        className="rounded-md border px-2 py-1"

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

                    </CardContent>

                </Card>

            </>

        );

    };


    // =====================================================
    // PAGE ROUTER
    // =====================================================

    const renderPage = () => {

        switch (page) {

            case "quick-create":

                return <QuickCreatePage />;


            case "tickets":

                return <TicketsPage />;


            case "employees":

                return <EmployeesPage />;


            case "assets":

                return <AssetsPage />;


            case "reports":

                return <ReportsPage />;


            case "ticket-reports":

                return <TicketReportsPage />;


            case "more":

                return <MorePage />;


            case "settings":

                return <SettingsPage />;


            case "help":

                return <HelpPage />;


            case "dashboard":

            default:

                return renderDashboard();

        }

    };


    // =====================================================
    // APPLICATION SHELL
    // =====================================================

    return (

        <SidebarProvider defaultOpen={true}>

            <AppSidebar />


            <SidebarInset>

                <SiteHeader />


                <main className="flex flex-1 flex-col gap-6 p-6">

                    {renderPage()}

                </main>

            </SidebarInset>

        </SidebarProvider>

    );

}


export default App;