import React, { useState } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container } from 'reactstrap';

export default function Login({ history }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = async evt => {
    evt.preventDefault();

    const response = await api.post('/login', { email, password })
    const userId = response.data._id || false;

    if (userId) {
      localStorage.setItem('user', userId)
      history.push('/dashboard')
    } else {
      const { message } = response.data
      console.log(message)
    }

  }

  return (
    <Container>
      <h2>Login:</h2>
      <p>Por favor faça o <strong>login</strong> na sua conta</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input type="email" name="email" id="exampleEmail" placeholder="seu email"
            onChange={evt => setEmail(evt.target.value)} />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input type="password" name="password" id="examplePassword" placeholder="sua senha"
            onChange={evt => setPassword(evt.target.value)} />
        </FormGroup>
        <Button>Enviar</Button>
      </Form>
    </Container>
  );
}