import { useEffect, useState } from "react";

import { getEmployees } from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Users } from "lucide-react";


function EmployeesPage() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadEmployees = async () => {

            try {

                const data = await getEmployees();

                setEmployees(data);

            } catch (error) {

                console.error(
                    "Unable to load employees:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadEmployees();

    }, []);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Employees
                </h1>

                <p className="text-muted-foreground">
                    Employees registered in the service desk.
                </p>

            </div>


            <Card>

                <CardHeader>

                    <CardTitle className="flex items-center gap-2">

                        <Users className="size-5" />

                        Employee Directory

                    </CardTitle>

                </CardHeader>


                <CardContent>

                    {loading ? (

                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Loading employees...
                        </p>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="border-b">

                                    <tr>

                                        <th className="px-3 py-3 text-left">
                                            ID
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Name
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Email
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Department
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {employees.map(
                                        (employee) => (

                                            <tr
                                                key={
                                                    employee.employee_id
                                                }
                                                className="border-b last:border-0"
                                            >

                                                <td className="px-3 py-3">
                                                    {employee.employee_id}
                                                </td>

                                                <td className="px-3 py-3 font-medium">
                                                    {employee.name}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {employee.email}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {employee.department}
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


export default EmployeesPage;