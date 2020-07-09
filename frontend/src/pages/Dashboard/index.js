import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup, Alert } from 'reactstrap';
import './dashboard.css'

export default function Dashboard({history}) {
  const [events, setEvents] = useState([]);
  const user_id = localStorage.getItem('user');
  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getEvents()
  }, [])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const myEventsHandler = async () => {
    setRSelected('myevents')
    const response = await api.get('/user/events', { headers: { user_id }})
    setEvents(response.data)
  }

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : '/dashboard'
    const response = await api.get(url, { headers: { user_id } })

    setEvents(response.data)
  };
  const deleteEventHandler = async(eventId) => {
    try {
      await api.delete(`/event/${eventId}`);
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        filterHandler(null)
      }, 2500)
      
    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
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
        <Button color="secondary" onClick={() => history.push('events')}>Eventos</Button>
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
            <Button color="primary">Inscrever</Button>
          </li>
        ))}
      </ul>
        {error ? (
          <Alert className="event-validation" color="danger">Erro ao deletar evento</Alert>
        ) : ""}
        {success ? (
          <Alert className="event-validation" color="success">Evento deletado com sucesso</Alert>
        ) : ""}
    </>
  )
}