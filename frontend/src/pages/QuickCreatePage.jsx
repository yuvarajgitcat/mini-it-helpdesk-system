import { useEffect, useState } from "react";

import {
    getEmployees,
    getAssets,
    createTicket
} from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Ticket, User, Laptop, Send } from "lucide-react";


function QuickCreatePage() {

    const [employees, setEmployees] = useState([]);
    const [assets, setAssets] = useState([]);

    const [form, setForm] = useState({
        employee_id: "",
        asset_id: "",
        title: "",
        description: "",
        priority: "MEDIUM"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    employeeData,
                    assetData
                ] = await Promise.all([
                    getEmployees(),
                    getAssets()
                ]);

                setEmployees(employeeData);
                setAssets(assetData);

            } catch (error) {

                console.error(
                    "Unable to load form data:",
                    error
                );

            }

        };

        loadData();

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

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

            setMessage(
                "Ticket created successfully."
            );

        } catch (error) {

            setMessage(
                error.message ||
                "Unable to create ticket."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Quick Create
                </h1>

                <p className="text-muted-foreground">
                    Create a service desk incident quickly.
                </p>

            </div>


            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">


                <Card>

                    <CardHeader>

                        <CardTitle>
                            New Service Ticket
                        </CardTitle>

                    </CardHeader>


                    <CardContent>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            <div className="grid gap-4 md:grid-cols-2">


                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Employee
                                    </label>

                                    <select
                                        name="employee_id"
                                        value={form.employee_id}
                                        onChange={handleChange}
                                        required
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    >

                                        <option value="">
                                            Select employee
                                        </option>

                                        {employees.map(
                                            (employee) => (

                                                <option
                                                    key={
                                                        employee.employee_id
                                                    }
                                                    value={
                                                        employee.employee_id
                                                    }
                                                >
                                                    {employee.name}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Asset
                                    </label>

                                    <select
                                        name="asset_id"
                                        value={form.asset_id}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    >

                                        <option value="">
                                            No asset
                                        </option>

                                        {assets.map(
                                            (asset) => (

                                                <option
                                                    key={
                                                        asset.asset_id
                                                    }
                                                    value={
                                                        asset.asset_id
                                                    }
                                                >
                                                    {asset.asset_tag} — {asset.model || asset.asset_type}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Issue title
                                </label>

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Example: VPN disconnecting repeatedly"
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                />

                            </div>


                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Describe the problem, symptoms and what the user observed..."
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                />

                            </div>


                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                >

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                </select>

                            </div>


                            {message && (

                                <div className="rounded-md border bg-muted px-4 py-3 text-sm">
                                    {message}
                                </div>

                            )}


                            <Button
                                type="submit"
                                disabled={loading}
                            >

                                <Send className="mr-2 size-4" />

                                {loading
                                    ? "Creating..."
                                    : "Create Ticket"
                                }

                            </Button>

                        </form>

                    </CardContent>

                </Card>


                <div className="space-y-4">


                    <Card>

                        <CardContent className="p-5">

                            <Ticket className="mb-3 size-5" />

                            <h3 className="font-semibold">
                                Incident
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Every request becomes a trackable
                                service-desk ticket.
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardContent className="p-5">

                            <User className="mb-3 size-5" />

                            <h3 className="font-semibold">
                                Employee
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Link the incident directly to the
                                affected employee.
                            </p>

                        </CardContent>

                    </Card>


                    <Card>

                        <CardContent className="p-5">

                            <Laptop className="mb-3 size-5" />

                            <h3 className="font-semibold">
                                Asset
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Associate hardware or another managed
                                asset with the incident.
                            </p>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>

    );

}


export default QuickCreatePage;