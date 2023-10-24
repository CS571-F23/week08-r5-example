import React, { memo } from "react"

function Ticket(props) {

    console.log("Ticket has rendered!")

    return <>
        <h2>{props.name}</h2>
        <i>{props.filer}</i>
        <p>{props.description}</p>
        <button onClick={() => props.hide(props.id)}>Hide!</button>
    </>
}

export default memo(Ticket);