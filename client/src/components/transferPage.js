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
    FormControlLabel,
    Checkbox,
    Card
} from '@material-ui/core';
import UserService from '../services/userService';
import TransactionService from '../services/transactionServer';

const styles = { 
    formControl: {
        marginBottom: 20,
    }
};


class TransferPage extends Component {
    constructor(props) {
        super(props)
        this.state={
            accountNumber : "",
            cellphone: "",
            cpf: "",
            name: "",
            amout: 0,
            favorites: [],
            favoriteAccountNumber: '',
            saveAsFavorite: false,
        }
    }

    componentDidMount() {
        this.loadFavorites()
    }

    handleChange(event) {
        const favoriteAccountNumber = event.target.value
        const {name, accountNumber, cpf } = this.state.favorites.filter(x => x.accountNumber == favoriteAccountNumber)[0]
        this.setState({name, accountNumber, cpf, favoriteAccountNumber})
        event.preventDefault();
    }

    async loadFavorites() {
        const favorites = await UserService.loadFavorites(this.props.user.id)
        if(favorites) this.setState({favorites})
    }

    renderFavorites = () => {
        const favorites = this.state.favorites
        return (
            favorites.map(favorite => <MenuItem key={favorite.accountNumber} value={favorite.accountNumber}>{`${favorite.accountNumber} - ${favorite.name}`}</MenuItem>)
        )
    }

    validateForm() {
        return true
    }

    doTransaction = async () => {
        if(this.validateForm()){
            const toUser = await UserService.findUser(
                this.state.accountNumber, 
                this.state.name,
                this.state.cpf
            )

            if (this.state.saveAsFavorite) {
                await UserService.addOrUpdateFavorite(this.props.user.id, toUser)
            }

            try {
                await TransactionService.create(
                    this.props.user.id, 
                    toUser.id, 
                    parseFloat(this.state.amount)
                )
                this.props.callback()
            }
            catch(e) {
                if(e.error && e.error.message == "Invalid transaction") {
                    console.log('invalid transaction')
                } else if(e.error && e.error.message == "Need to use limit") {
                    console.log('need limit')
                } else if(e.error && e.error.message == "Limit is not enough") {
                    console.log('not enough')
                } else {
                    console.log('erro')
                }
            }
        }
    }

    render() {
        return (
            <Card style={{padding: 20}}>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <FormControl style={styles.formControl} fullWidth={true}>
                        <InputLabel htmlFor="user">Selecionar Favorito</InputLabel>
                        <Select
                            value={this.state.favoriteAccountNumber}
                            onChange={(e) => this.handleChange(e)}
                            inputProps={{
                                name: 'name',
                                id: 'user',
                            }}
                            input={<Input name="favorite" id="favorite-input" />}
                        >
                            {this.renderFavorites()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl style={styles.formControl} fullWidth>
                        <InputLabel>Número da conta</InputLabel>
                        <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={this.state.accountNumber}
                            onChange={(e) => {
                                console.log(e.target.value)
                                this.setState({...this.state, accountNumber: e.target.value})
                            }
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl style={styles.formControl} fullWidth>
                        <InputLabel>Nome</InputLabel>
                        <Input
                            fullWidth
                            id="name"
                            name="name"
                            value={this.state.name}
                            onChange={(e) => this.setState({...this.state, name: e.target.value})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl style={styles.formControl} fullWidth>
                        <InputLabel>CPF</InputLabel>
                        <Input
                            fullWidth
                            id="cpf"
                            name="cpf"
                            value={this.state.cpf}
                            onChange={(e) => this.setState({...this.state, cpf: e.target.value})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={styles.formControl} fullWidth>
                        <InputLabel>Valor a ser transferido</InputLabel>
                        <Input
                            fullWidth
                            id="amount"
                            name="amount"
                            value={ this.state.amount }
                            type="number"
                            onChange={(e) => this.setState({...this.state, amount: e.target.value})}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                checked={this.state.saveAsFavorite}
                                value={"saveAsFavorite"} 
                                onChange={(e) => {this.setState({saveAsFavorite: e.target.checked})}}
                            />
                        } 
                        label="salvar favorito" 
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        style={styles.transferButton}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={() => this.doTransaction()}
                    >
                        Transferir
                    </Button> 
                </Grid>
                <Grid item xs={4}>
                    <Button
                        style={styles.transferButton}
                        size="large"
                        onClick={() => this.props.callback()}
                    >
                        Cancelar 
                    </Button> 
                </Grid>
            </Grid>
            </Card>
        )
    }
}

export default TransferPage 