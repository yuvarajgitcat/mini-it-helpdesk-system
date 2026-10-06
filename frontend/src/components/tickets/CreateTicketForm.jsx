import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CreateTicketForm({
    employees,
    assets,
    form,
    setForm,
    onSubmit
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Ticket</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">

                    {/* Employee */}

                    <div className="space-y-2">
                        <label htmlFor="employee">
                            Employee
                        </label>

                        <select
                            id="employee"
                            value={form.employee_id}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    employee_id: e.target.value
                                })
                            }
                            required
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="">
                                Select employee
                            </option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.employee_id}
                                    value={employee.employee_id}
                                >
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Asset */}

                    <div className="space-y-2">
                        <label htmlFor="asset">
                            Asset
                        </label>

                        <select
                            id="asset"
                            value={form.asset_id}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    asset_id: e.target.value
                                })
                            }
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="">
                                No asset
                            </option>

                            {assets.map((asset) => (
                                <option
                                    key={asset.asset_id}
                                    value={asset.asset_id}
                                >
                                    {asset.asset_tag} - {asset.asset_type}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Title */}

                    <div className="space-y-2">
                        <label htmlFor="title">
                            Title
                        </label>

                        <Input
                            id="title"
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }
                            placeholder="Enter ticket title"
                            required
                        />
                    </div>


                    {/* Description */}

                    <div className="space-y-2">
                        <label htmlFor="description">
                            Description
                        </label>

                        <Textarea
                            id="description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                            placeholder="Describe the issue"
                            rows={4}
                            required
                        />
                    </div>


                    {/* Priority */}

                    <div className="space-y-2">
                        <label htmlFor="priority">
                            Priority
                        </label>

                        <select
                            id="priority"
                            value={form.priority}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priority: e.target.value
                                })
                            }
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="LOW">
                                LOW
                            </option>

                            <option value="MEDIUM">
                                MEDIUM
                            </option>

                            <option value="HIGH">
                                HIGH
                            </option>
                        </select>
                    </div>


                    {/* Submit */}

                    <Button type="submit">
                        Create Ticket
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}

export default CreateTicketForm;