import { useEffect, useState } from "react";
import { getTickets,getAssets,getEmployees,createTicket,updateTicketStatus} from "./services/api";

function App() {

    const [tickets, setTickets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assets, setAssets] = useState([]);

    const [form, setForm] = useState({
    employee_id: "",
    asset_id: "",
    title: "",
    description: "",
    priority: "MEDIUM"
});

    useEffect(() => {
        async function loadData() {
            try {
                const ticketData = await getTickets();
                const employeeData = await getEmployees();
                const assetData = await getAssets();

                setTickets(ticketData);
                setEmployees(employeeData);
                setAssets(assetData);

            } catch (error) {
                console.error("Error loading data:", error);
            }
        }

        loadData();
    }, []);


    // --------------------------------------------------
    // CREATE TICKET
    // --------------------------------------------------

    const handleCreateTicket = async (e) => {

        e.preventDefault();

        try {

            await createTicket({

                employee_id: Number(form.employee_id),

                asset_id: form.asset_id
                    ? Number(form.asset_id)
                    : null,

                title: form.title,

                description: form.description,

                priority: form.priority

            });


            // Clear form after successful creation

            setForm({
                employee_id: "",
                asset_id: "",
                title: "",
                description: "",
                priority: "MEDIUM"
            });


            // Reload tickets so the new ticket appears

            const updatedTickets = await getTickets();

            setTickets(updatedTickets);


        } catch (error) {

            console.error("Error creating ticket:", error);

        }

    };


    // --------------------------------------------------
    // UPDATE TICKET STATUS
    // --------------------------------------------------

    const handleStatusChange = async (ticketId, newStatus) => {

        try {

            await updateTicketStatus(
                ticketId,
                newStatus
            );


            // Reload tickets after status update

            const updatedTickets = await getTickets();

            setTickets(updatedTickets);


        } catch (error) {

            console.error(
                "Error updating ticket:",
                error
            );

        }

    };



    return (

        <div>

            {/* ----------------------------------------- */}
            {/* PAGE TITLE */}
            {/* ----------------------------------------- */}

            <h1>IT Helpdesk Dashboard</h1>


            {/* ----------------------------------------- */}
            {/* CREATE TICKET FORM */}
            {/* ----------------------------------------- */}

            <h2>Create Ticket</h2>


            <form onSubmit={handleCreateTicket}>

                {/* EMPLOYEE */}

                <div>

                    <label>
                        Employee:
                    </label>

                    {" "}

                    <select
                        value={form.employee_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                employee_id: e.target.value
                            })
                        }
                        required
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


                <br />


                {/* ASSET */}

                <div>

                    <label>
                        Asset:
                    </label>

                    {" "}

                    <select
                        value={form.asset_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                asset_id: e.target.value
                            })
                        }
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


                <br />


                {/* TITLE */}

                <div>

                    <label>
                        Title:
                    </label>

                    {" "}

                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value
                            })
                        }
                        required
                    />

                </div>


                <br />


                {/* DESCRIPTION */}

                <div>

                    <label>
                        Description:
                    </label>

                    {" "}

                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value
                            })
                        }
                        required
                    />

                </div>


                <br />


                {/* PRIORITY */}

                <div>

                    <label>
                        Priority:
                    </label>

                    {" "}

                    <select
                        value={form.priority}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                priority: e.target.value
                            })
                        }
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


                <br />


                {/* SUBMIT */}

                <button type="submit">
                    Create Ticket
                </button>

            </form>


            <hr />


            {/* ----------------------------------------- */}
            {/* TICKET STATISTICS */}
            {/* ----------------------------------------- */}

            <h2>Tickets</h2>

            <p>
                Total Tickets: {tickets.length}
            </p>


            {/* ----------------------------------------- */}
            {/* TICKET TABLE */}
            {/* ----------------------------------------- */}

            <table border="1">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Title</th>

                        <th>Employee</th>

                        <th>Asset</th>

                        <th>Priority</th>

                        <th>Status</th>

                    </tr>

                </thead>


                <tbody>

                    {tickets.map((ticket) => (

                        <tr key={ticket.ticket_id}>

                            <td>
                                {ticket.ticket_id}
                            </td>


                            <td>
                                {ticket.title}
                            </td>


                            <td>
                                {ticket.employee_name}
                            </td>


                            <td>
                                {ticket.asset_tag || "No asset"}
                            </td>


                            <td>
                                {ticket.priority}
                            </td>


                            <td>

                                <select
                                    value={ticket.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            ticket.ticket_id,
                                            e.target.value
                                        )
                                    }
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

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default App;



// [ Trigger: setTickets(data) ]
//           │
//           ▼
// 1. Run App() function body ──> Pulls data from state vault ([ticket1, ticket2])
//           │
//           ▼
// 2. Paint UI to Screen ────────> User immediately sees "Total Tickets: 2"
//           │
//           ▼
// 3. Evaluate useEffect ────────> Checks dependency array [].
//                                 Comparison: [] (Frame 1) vs [] (Frame 2) -> Unchanged!
//           │
//           ▼
// 4. Skip Callback ─────────────> loadTickets() is completely skipped!