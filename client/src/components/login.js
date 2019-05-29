import React, {Component} from 'react';
import {
    Grid, 
    Typography, 
    Button, 
    Select, 
    MenuItem, 
    Paper, 
    Divider, 
    Input,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import FetchService from '../services/fetchService'
import UserService from '../services/userService';

const styles = {
  form: { 
      padding: 20, 
      marginTop: 20,
      width: 700,
      minHeight: 200,
      justifyContent: 'center'
  },
  formControl: {
    margin: '10px 0'
  },
  buttonPanel: {
    marginTop: 20
  },
  content: {
    marginTop: 60,
  },
  button: {
      marginTop: 20,
}
};


class Login extends Component {
    constructor(props)  {
        super(props)
        this.state = {
            selectedUser: '',
            users: []
        }
    }

    componentDidMount() {
        this.loadUsers()
    }

    async loadUsers() {
        FetchService.get('/users').then(data => {
            this.setState({users: data})
        })
    }

    handleChange = (event) => {
        this.setState({selectedUser: event.target.value});
    }

    handleLogin = async (event) => {
        if(!this.state.selectedUser) {
            console.error('selecione um usuario')
            return
        }
        try {
            await UserService.login(this.state.selectedUser)
            this.props.history.push('/home')
        }
        catch(e) {
            console.error('erro')
        }
    }

    renderUsers() {
        const { users } = this.state
        return (
            users.map(user=> <MenuItem value={user.id}>{user.name}</MenuItem>)
        )
    }

    render() {
        const {selectedUser }= this.state
        return (
            <Grid container justify="center">
                <Paper style={styles.form}>
                    <Typography variant="h3">Selecione um usuário</Typography>
                    <Divider />
                    <div style={styles.content}>
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor="user">Usuário</InputLabel>
                        <Select
                            value={selectedUser}
                            onChange={(e) => this.handleChange(e)}
                            inputProps={{
                                name: 'name',
                                id: 'user',
                            }}
                            input={<Input name="user" id="user-input" />}
                        >
                            {this.renderUsers()}
                        </Select>
                    </FormControl>
                    <Button
                        style={styles.button}
                        onClick={this.handleLogin}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                    >
                        Logar
                    </Button>
                    <Button
                        style={styles.button}
                        fullWidth
                        size="large"
                        color="primary"
                        onClick={() => this.props.history.push('/register')}
                    >
                        Cadastrar-se
                    </Button>
                    </div>
                </Paper>
            </Grid>

        )
    }
}

export default Login