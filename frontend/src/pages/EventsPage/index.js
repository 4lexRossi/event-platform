import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Label, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import cameraIcon from '../../assets/camera.png';
import "./events.css";

export default function EventsPage({ history }) {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState('Evento');
  const [date, setDate] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdowOpen, setOpen] = useState(false);
  const user = localStorage.getItem('user');

  useEffect(() =>{
    if(!user) history.push('/login');
  },[])
  
  const toggle = () => setOpen(!dropdowOpen);
  
  
  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const submitHandler = async (evt) => {
    evt.preventDefault()

    const eventData = new FormData();

    eventData.append("thumbnail", thumbnail)
    eventData.append("sport", sport)
    eventData.append("title", title)
    eventData.append("price", price)
    eventData.append("description", description)
    eventData.append("date", date)

    try {
      if (title !== "" &&
        description !== "" &&
        price !== "" &&
        sport !== "Evento" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user } })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          history.push('/')
        }, 2000)   
      } else {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 2000)        
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error)
    }
  }

  const sportEventHandler = (sport) => setSport(sport)

  return (
    <Container>
      <h1>Registre seu Evento</h1>
      <Form onSubmit={submitHandler}>
        <div className="input-group">
          <FormGroup>          
              <Label>Envie a Imagem</Label>
              <Label id='thumbnail' style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                <Input id="thumbnail" type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
                <img src={cameraIcon} style={{ maxWidth: "50px" }} alt="icone de enviar arquivo" />
              </Label>
            </FormGroup>            
            <FormGroup>
              <Label>Nome do evento: </Label>
              <Input id="title" type="text" value={title} placeholder={'Nome do Evento'} onChange={(evt) => setTitle(evt.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Descrição do evento: </Label>
              <Input id="description" type="text" value={description} placeholder={'Descrição do Evento'} onChange={(evt) => setDescription(evt.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Valor do evento: </Label>
              <Input id="price" type="text" value={price} placeholder={'Valor R$:0.00'} onChange={(evt) => setPrice(evt.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Data do evento: </Label>
              <Input id="date" type="date" value={date} placeholder={'00/00/0000'} onChange={(evt) => setDate(evt.target.value)} />
            </FormGroup>
            <FormGroup>              
              <ButtonDropdown isOpen={dropdowOpen} toggle={toggle}>
                <Button id="caret" value={sport} disabled>{sport}</Button>
                <DropdownToggle caret />
                <DropdownMenu>                  
                  <DropdownItem onClick={() => sportEventHandler('Esportes')}>Esportes</DropdownItem>
                  <DropdownItem onClick={() => sportEventHandler('Social')}>Social</DropdownItem>                  
                  <DropdownItem onClick={() => sportEventHandler('Religioso')}>Religioso</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </FormGroup>
        </div>
        <FormGroup>
          <Button type="submit" className="submit-btn">
            Criar Evento</Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/")}>
            Cancelar</Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">Está faltando dados obrigatórios</Alert>
      ) : ""}
      {success ? (
        <Alert className="event-validation" color="success">Evento criado com sucesso</Alert>
      ) : ""}
    </Container>
  )
}