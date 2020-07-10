import React, { useState } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Alert } from 'reactstrap';

export default function Register({ history }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async evt => {
    evt.preventDefault();

    if(email !== "" && password !== "" && firstName !== "" && lastName !== ""){
      const response = await api.post('/user/register', { email, password, firstName, lastName })
      const user = response.data.user || false;
      const user_id = response.data.user_id || false;
  
      if (user && user_id) {
        localStorage.setItem('user', user)
        localStorage.setItem('user_id', user_id)
        history.push('/')
      } else {
        const { message } = response.data
          setError(true)  
          setErrorMessage(message)
          setTimeout(() =>{
            setError(false)
            setErrorMessage("")
        }, 2000)
      }

    }else{
      setError(true)
      setErrorMessage("Precisa preencher todos os campos")
      setTimeout(() =>{
        setError(false)
        setErrorMessage("")
      }, 2000)
    }
  }

  return (
    <Container>
      <h2>Registro:</h2>
      <p>Por favor faça o <strong>registro</strong> da sua nova conta</p>
      <Form onSubmit={handleSubmit}>
        <div className="input-group">
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input type="text" name="firstName" id="firstName" placeholder="Nome"
              onChange={evt => setFirstName(evt.target.value)} />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input type="text" name="lastName" id="lastName" placeholder="Sobrenome"
              onChange={evt => setLastName(evt.target.value)} />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input type="email" name="email" id="exampleEmail" placeholder="seu email"
              onChange={evt => setEmail(evt.target.value)} />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input type="password" name="password" id="examplePassword" placeholder="sua senha"
              onChange={evt => setPassword(evt.target.value)} />
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">Cadastrar</Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/login")}>Deseja logar?</Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">Está faltando dados obrigatórios</Alert>
      ) : ""}
    </Container>
  );
}