import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup, Alert } from 'reactstrap';
import socketio from 'socket.io-client';

import './dashboard.css'
import { use } from '../../../../backend/src/routes';
import Registration from '../../../../backend/src/models/Registration';

export default function Dashboard({history}) {
  const [events, setEvents] = useState([]);
  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');
  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState('');
  useEffect(() => {
    getEvents()
  }, [])

  useEffect(() =>{
    const socket = socketio('http://localhost:8000/', { query: { user }})

    socket.on('registration_request', data => console.log(data))
  }, [])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const myEventsHandler = async () => {
    try {
      setRSelected('myevents')
      const response = await api.get('/user/events', { headers: { user: user }})
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
  const deleteEventHandler = async(eventId) => {
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

  const logoutHandler = () =>{
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    history.push('/login');
  }

  const registrationRequestHandler = async (event) =>{
    try {
      await api.post(`/registration/${event.id}`, {}, { headers: { user }})

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

  return (
    <>      
      <div className="filter-panel">
        <ButtonGroup>
          <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>Todos Eventos</Button>
          <Button color="primary" onClick={myEventsHandler} active={rSelected === 'myevents'}>Meus Eventos</Button>
          <Button color="primary" onClick={() => filterHandler('Esportes')} active={rSelected === 'Esportes'}>Esportes</Button>
          <Button color="primary" onClick={() => filterHandler('Social')} active={rSelected === 'Social'}>Social</Button>
          <Button color="primary" onClick={() => filterHandler('Religioso')} active={rSelected === 'Religioso'}>Religioso</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="secondary" onClick={() => history.push('events')}>Eventos</Button>
          <Button color="danger" onClick={logoutHandler}>logout</Button>
        </ButtonGroup>
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