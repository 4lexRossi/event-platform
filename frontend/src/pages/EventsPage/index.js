import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Label, Alert } from 'reactstrap';
import cameraIcon from '../../assets/camera.png';
import "./events.css";

export default function EventsPage({ history }) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)


  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const submitHandler = async (evt) => {
    evt.preventDefault()
    const user_id = localStorage.getItem('user');

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
        sport !== "" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user_id } })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
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
              <Label>Evento: </Label>
              <Input id="sport" type="text" value={sport} placeholder={'Nome do Evento'} onChange={(evt) => setSport(evt.target.value)} />
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
        </div>
        <FormGroup>
          <Button type="submit" className="submit-btn">
            Criar Evento</Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/dashboard")}>
            Listar Eventos</Button>
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