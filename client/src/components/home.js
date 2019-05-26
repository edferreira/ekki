import React, {Component} from 'react';
import { Redirect, withRouter} from 'react-router-dom';
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
    Link
} from '@material-ui/core';
import FetchService from '../services/fetchService'

const styles = {
  container: { 
      padding: 20, 
      marginTop: 20,
      width: 700,
      justifyContent: 'center'
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
        this.loadUser()
    }

    loadUser() {

    }

    renderWallet() {
        
    }

    renderTransactions() {
        
    }

    render() {
        return (
            <Grid container justify="center" style={{height: '100%'}}>
                <Paper style={styles.container}>
                    {this.renderWallet()}
                    <Divider/>
                    {this.renderTransactions()}
                </Paper>
            </Grid>

        )
    }
}

export default Login