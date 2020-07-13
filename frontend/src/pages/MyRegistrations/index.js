import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { Button, ButtonGroup } from 'reactstrap';
import './myRegistration.css'

import api from '../../services/api';


export default function MyRegistrations() {

  const [myEvents, setMyEvents] = useState([])
  const user = localStorage.getItem('user')

  useEffect(() => {
    getMyEvents()
  },[])

  const getMyEvents = async () => {
    try {
      const response = await api.get('/registration', {headers: { user }})
      setMyEvents(response.data)
    } catch (error) {
       
    }

  }

  const isApproved = (approved) => approved === true ? "Aprovado" : "Declinado"
  
  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })  
      getMyEvents()   

    } catch (err) {
      console.log(err)
    }
  }
  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })
      getMyEvents()  

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ul className="events">
      {myEvents.map(event => (
        <li key={event._id}>
          <div><strong>{event.eventTitle}</strong></div>
          <div className="events-details">
            <span>Event Date: {moment(event.eventDate).format('dd/mm/YYYY')}</span>
            <span>Event Price R$:{parseFloat(event.eventPrice).toFixed(2)}</span>
            <span>User Email: {event.userEmail}</span>
            <span>Status: 
              <span className={event.approved !== undefined ? isApproved(event.approved): "Pendente"}>{event.approved !== undefined ? isApproved(event.approved): "Pendente"}</span>
            </span>
          </div>
          <ButtonGroup>
            <Button disabled={event.approved === true || event.approved === false ? true : false} color="primary" onClick={() => acceptEventHandler(event._id)}>Aceitar</Button>
            <Button disabled={event.approved === true || event.approved === false ? true : false} color="danger" onClick={() => rejectEventHandler(event._id)}>Declinar</Button>
          </ButtonGroup>
        </li>
      ))}
    </ul>
  )
}

