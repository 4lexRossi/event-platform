import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup } from 'reactstrap';
import './dashboard.css'

export default function Dashboard(){
  const [events, setEvents] = useState([]);
  const user_id = localStorage.getItem('user');
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);

  useEffect(() => {
    getEvents()
  }, [])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : '/dashboard'
    const response = await api.get(url, { headers: { user_id }})

    setEvents(response.data)    
  };  
  
  return (
    <>
      <div>Filtro: <ButtonGroup>
                    <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>Todos Eventos</Button>
                    <Button color="primary" onClick={() => filterHandler('esportes')} active={rSelected === 'esportes'}>Esportes</Button>
                    <Button color="primary" onClick={() => filterHandler('social')} active={rSelected === 'social'}>Social</Button>
                    <Button color="primary" onClick={() => filterHandler('religioso')} active={rSelected === 'religioso'}>Religioso</Button>
                  </ButtonGroup>
      </div>
      <ul className="events-list">
        {events.map(event =>(
          <li key={event._id}>
            <header style={{ backgroundImage: `url(${event.thumbnail_url})`}} />
            <strong>{event.title}</strong>
            <span>Data: {moment(event.date).format('DD/MM/YYYY')}</span>
            <span>Valor R$: {parseFloat(event.price).toFixed(2)}</span>
            <span>Descrição: {event.description}</span>
            <Button color="primary">Inscrever</Button>
          </li>
        ))}      
      </ul> 
    </>
  )
}