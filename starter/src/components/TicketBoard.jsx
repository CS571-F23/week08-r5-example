import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import Ticket from "./Ticket";

export default function TicketBoard(props) {

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const [tickets, setTickets] = useState([]);
    const [hiddenTicketIds, setHiddenTicketIds] = useState([])

    const hide = (id) => {
        setHiddenTicketIds(oldTicketIds => [...oldTicketIds, id])
    };

    const loadTickets = () => {
        fetch('https://cs571.org/api/f23/weekly/week07', {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data);
            })
    };

    useEffect(loadTickets, [])

    const createTicket = () => {
        fetch('https://cs571.org/api/f23/weekly/week07', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({
                name: newTitle,
                description: newContent
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error()
            }
        }).then(json => {
            console.log("Recieved back...");
            console.log(json);
            alert('Successfully made ticket!')
            loadTickets();
        }).catch(e => {
            alert('An error occured while making the request')
        })
    };

    console.log("Ticket Board has rendered!")

    return <div>
        <h1>Ticket Board</h1>
        <p>Create a ticket...</p>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <br/>
            <label htmlFor="content">Content</label>
            <input id="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
        </form>
        <Button
            onClick={createTicket}
            style={{ marginTop: "1rem" }}
        >Create a Ticket</Button>
        <hr />
        {
            tickets
                .filter(tick => !hiddenTicketIds.some(hid => tick.id === hid))
                .map(t => <Ticket key={t.id} hide={hide} {...t} />)
        }
    </div>
}