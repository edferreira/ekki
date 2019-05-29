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
    Link,
    ListItem,
    List,
    ListItemText
} from '@material-ui/core';
import UserService from '../services/userService';
import TransferPage from './transferPage'

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
    transferButton: {
        marginTop: 40,
        marginBottom: 20,
    }
};

class Login extends Component {
    constructor(props)  {
        super(props)
        this.state = {
            user: {},
            transactions: [],
            transferPageOpen: false
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        await this.loadUser()
        this.loadTransactions()
    }

    async loadUser(){
        const user = await UserService.getUser();
        this.setState({user})
    }

    async loadTransactions() {
        this.setState({loadingTransactions: true})
        const userId = this.state.user.id
        let transactions = []
        try {
            transactions = await UserService.getTransactions(userId)
            for(const transactionId in transactions) {
                const transaction = transactions[transactionId];
                if (transaction.to === userId) {
                    transactions[transactionId].to = this.state.user
                    transactions[transactionId].from = await UserService.findById(transaction.from)
                }
                else if (transaction.from === userId) {
                    transactions[transactionId].from = this.state.user
                    transactions[transactionId].to = await UserService.findById(transaction.to)
                }
            }
        }
        catch(e) {
            console.error(e)
        }
        finally {
            console.log(transactions)
            this.setState({loadingTransactions: false, transactions})
        }
    }

    renderWallet() {
        return (
            <>
                <Typography align="center" variant="h3">{this.state.user.name} </Typography>
                <Typography align="center" variant="h3">R$ {this.state.user.amount}</Typography>
            </>
        )
    }

    transferDone = () => {
        this.setState({transferPageOpen: false})
        this.load()
    }

    renderTransactionForm() {
        return (
            <TransferPage user={this.state.user} callback={this.transferDone}/> 
        )
    }

    openTransferPage() {
        this.setState({
            transferPageOpen: true,
        })
    }

    renderTransactionItem(item) {
        return (
            <ListItem key={item.id}>
                { 
                    item.from.id === this.state.user.id ? (
                        <ListItemText primary={`enviado ${item.amount} para ${item.to.name}`} />
                    ): (
                        <ListItemText primary={`recebido ${item.amount} de ${item.from.name}`} />
                    )
                }
            </ListItem>
        )
    }

    renderTransactions() {
        return(
            <List style={{height: 200, overflow: 'auto'}} >
                {this.state.transactions.map(transaction=>this.renderTransactionItem(transaction))}
            </List>
        )
    }

    render() {
        return (
            <Grid container justify="center" style={{height: '100%'}}>
                <Paper style={styles.container}>
                    {this.renderWallet()}
                    {this.state.transferPageOpen === false ? (
                        <>
                            <Button
                                style={styles.transferButton}
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => this.openTransferPage()}
                                fullWidth
                            >
                                Transferir
                            </Button> 
                            <Divider/>
                            {this.renderTransactions()}
                        </>
                    ): (
                        this.renderTransactionForm()
                    )}
                </Paper>
            </Grid>
        )
    }
}

export default Login