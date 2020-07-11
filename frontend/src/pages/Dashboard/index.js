import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import socketio from 'socket.io-client';

import './dashboard.css'

export default function Dashboard({ history }) {
  const [events, setEvents] = useState([]);
  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');
  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState('');
  const [eventRequests, setEventsRequests] = useState([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [eventRequestMessage, setEventRequestMessage] = useState('')
  const [eventRequestSuccess, setEventRequestSuccess] = useState(false)


  const toggle = () => setDropDownOpen(!dropDownOpen)

  useEffect(() => {
    getEvents()
  }, [])

  const socket = useMemo(
    () =>
      socketio('http://localhost:8000/', { query: { user: user_id } }),
    [user_id]
  );

  useEffect(() => {
    socket.on('registration_request', data => (setEventsRequests([...eventRequests, data])))
  }, [eventRequests, socket])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const myEventsHandler = async () => {
    try {
      setRSelected('myevents')
      const response = await api.get('/user/events', { headers: { user: user } })
      setEvents(response.data.events)
    } catch (error) {
      history.push('/login');
    }
  }

  const getEvents = async (filter) => {
    try {
      const url = filter ? `/dashboard/${filter}` : '/dashboard'
      const response = await api.get(url, { headers: { user: user } })

      setEvents(response.data.events)

    } catch (error) {
      history.push('/login');

    }
  };
  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user: user } });
      setSuccess(true)
      setMessageHandler('Evento deletado com sucesso!')
      setTimeout(() => {
        setSuccess(false)
        filterHandler(null)
        setMessageHandler('')
      }, 2500)

    } catch (error) {
      setError(true)
      setMessageHandler('Erro ao excluir evento')
      setTimeout(() => {
        setError(false)
        setMessageHandler('')
      }, 2000)

    }
  }



  const registrationRequestHandler = async (event) => {
    try {
      await api.post(`/registration/${event.id}`, {}, { headers: { user } })

      setSuccess(true)
      setMessageHandler(`Inscrito no evento ${event.title} com sucesso!`)
      setTimeout(() => {
        setSuccess(false)
        filterHandler(null)
        setMessageHandler('')
      }, 2500)

    } catch (error) {
      setError(true)
      setMessageHandler(`Inscrição no evento ${event.title} não foi bem sucedida`)
      setTimeout(() => {
        setError(false)
        setMessageHandler('')
      }, 2000)
    }
  }
  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })

      setEventRequestSuccess(true)
      setEventRequestMessage('Inscrição no evento aprovada com sucesso!')
      removeNotificationFromDashboard(eventId)
      setTimeout(() => {
        setEventRequestSuccess(false)
        setEventRequestMessage('')
      }, 2000)

    } catch (err) {
      console.log(err)
    }
  }
  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })

      setEventRequestSuccess(true)
      setEventRequestMessage('Pedido de inscrição no evento rejeitado com sucesso!')
      removeNotificationFromDashboard(eventId)
      setTimeout(() => {
        setEventRequestSuccess(false)
        setEventRequestMessage('')
      }, 2500)

    } catch (err) {
      console.log(err)
    }
  }

  const removeNotificationFromDashboard = (eventId) => {
    const newEvents = eventRequests.filter ((event) => event._id !== eventId)
    setEventsRequests(newEvents);
  }

  return (
    <>
      <ul className="notifications">
        {eventRequests.map(request => {
          return (
            <li key={request._id}>
              <div>
                <strong>{request.user.email}</strong> está pedindo para se registrar em seu evento
                <strong>{request.event.title}</strong>
              </div>
              <ButtonGroup>
                <Button color="primary" onClick={() => acceptEventHandler(request._id)}>Aceitar</Button>
                <Button color="danger" onClick={() => rejectEventHandler(request._id)}>Declinar</Button>
              </ButtonGroup>
            </li>
          )
        })}
      </ul>
      {eventRequestSuccess ?<Alert color="success">{eventRequestMessage}</Alert> : ""}
      <div className="filter-panel">
        <Dropdown isOpen={dropDownOpen} toggle={toggle}>
          <DropdownToggle color="primary" caret>
            filter
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}>Todos os Eventos</DropdownItem>
            <DropdownItem onClick={myEventsHandler} active={rSelected === 'myevents'}>Meus Eventos</DropdownItem>
            <DropdownItem onClick={() => filterHandler('Esportes')} active={rSelected === 'Esportes'}>Esportes</DropdownItem>
            <DropdownItem onClick={() => filterHandler('Social')} active={rSelected === 'Social'}>Social</DropdownItem>
            <DropdownItem onClick={() => filterHandler('Religioso')} active={rSelected === 'Religioso'}>Religioso</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ul className="events-list">
        {events.map(event => (
          <li key={event._id}>
            <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
              {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>Delete</Button></div> : ""}
            </header>
            <strong>{event.title}</strong>
            <span>Data: {moment(event.date).format('DD/MM/YYYY')}</span>
            <span>Valor R$: {parseFloat(event.price).toFixed(2)}</span>
            <span>Descrição: {event.description}</span>
            <Button color="primary" onClick={() => registrationRequestHandler(event)}>Se inscrever no evento</Button>
          </li>
        ))}
      </ul>
      {error ? (
        <Alert className="event-validation" color="danger">{messageHandler}</Alert>
      ) : ""}
      {success ? (
        <Alert className="event-validation" color="success">{messageHandler}</Alert>
      ) : ""}
    </>
  )
}