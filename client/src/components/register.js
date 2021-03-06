import * as React from 'react';
import {
  Paper,
  FormControl,
  Input,
  InputLabel,
  Grid,
  Typography,
  Button,
  Divider
} from '@material-ui/core';

import FetchService from '../services/fetchService'
import CpfInput from './inputs/cpfInput';
import PhoneInput from './inputs/phoneInput';

const styles = {
  form: { padding: 20, width: 700 },
  formControl: {
    margin: '10px 0'
  },
  buttonPanel: {
    marginTop: 20
  }
};

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      name: '',
      cpf: '',
      cellphone: ''
    };
  }

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  handleRegister = async e => {
    const { name, cpf, cellphone } = this.state;

    try{
        const res = await FetchService.post('users', {name, cpf, cellphone})
        this.props.history.push('/')
    }
    catch(e) {
        console.error(e)
    }
  };

  render() {
    const { name, cpf, cellphone } = this.state;


    return (
      <Grid container justify="center">
        <Paper style={styles.form}>
          <Typography variant="h3">Criar Usuário</Typography>
          <Divider />
          <FormControl style={styles.formControl} fullWidth>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <Input
              fullWidth
              id="name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl style={styles.formControl} fullWidth>
            <InputLabel htmlFor="password">CPF</InputLabel>
            <Input
              id="cpf"
              name="cpf"
              value={cpf}
              onChange={this.handleChange}
              inputComponent={CpfInput}
            />
          </FormControl>
          <FormControl style={styles.formControl} fullWidth>
            <InputLabel htmlFor="cellphone">Celular</InputLabel>
            <Input
              id="cellphone"
              name="cellphone"
              value={cellphone}
              onChange={this.handleChange}
              inputComponent={PhoneInput}
            />
          </FormControl>
          <div style={styles.buttonPanel}>
            <Button
              style={styles.button}
              onClick={this.handleRegister}
              fullWidth
              size="large"
              variant="raised"
              color="primary"
            >
                Enviar
            </Button>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default Register