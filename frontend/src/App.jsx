import { useEffect, useState } from "react";
import { getTickets } from "./services/api";

function App() {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {

        async function loadTickets() {

            try {

                const data = await getTickets();

                setTickets(data);

            } catch (error) {

                console.error(error);

            }
        }

        loadTickets();

    }, []);

    return (
        <div>
      

        <h1>IT Helpdesk Dashboard</h1>

        <p>
            Total Tickets: {tickets.length}
        </p>

        <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Employee</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                {tickets.map((ticket) => (

                    <tr key={ticket.ticket_id}>

                        <td>{ticket.ticket_id}</td>

                        <td>{ticket.title}</td>

                        <td>{ticket.employee_name}</td>

                        <td>{ticket.status}</td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

    );
}

export default App;