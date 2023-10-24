import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "react-bootstrap";
import Ticket from "./Ticket";

export default function TicketBoard(props) {

    const titleRef = useRef();
    const [newContent, setNewContent] = useState("");

    const [tickets, setTickets] = useState([]);
    const [hiddenTicketIds, setHiddenTicketIds] = useState([])

    const hide = useCallback((id) => {
        setHiddenTicketIds(oldTicketIds => [...oldTicketIds, id])
    }, []);

    const bodyContainsSwearWord = useMemo(() => {
        console.log("I checked for bad words!")
        return newContent.toLowerCase().includes("frik")
    }, [newContent]);

    const loadTickets = useCallback(() => {
        fetch('https://cs571.org/api/f23/weekly/week07', {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data);
            })
    }, []);

    useEffect(loadTickets, [])

    const createTicket = useCallback((nTitle, nContent) => {
        fetch('https://cs571.org/api/f23/weekly/week07', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({
                name: nTitle,
                description: nContent
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
    }, []);

    console.log("Ticket Board has rendered!")

    return <div>
        <h1>Ticket Board</h1>
        <p>Create a ticket...</p>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" ref={titleRef} />
            <br/>
            <label htmlFor="content">Content</label>
            <input id="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
        </form>
        <Button
            onClick={() => createTicket(titleRef.current.value, newContent)}
            style={{ marginTop: "1rem" }}
            disabled={bodyContainsSwearWord}
        >Create a Ticket</Button>
        <hr />
        {
            tickets
                .filter(tick => !hiddenTicketIds.some(hid => tick.id === hid))
                .map(t => <Ticket key={t.id} hide={hide} {...t} />)
        }
    </div>
}