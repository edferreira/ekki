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
    Card,
    Modal,
} from '@material-ui/core';
import UserService from '../services/userService';
import TransactionService from '../services/transactionServer';
import CpfInput from './inputs/cpfInput';
import MoneyInput from './inputs/moneyInput';
import { toast } from 'react-toastify';

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
            amount: '',
            useLimit: false,
            favorites: [],
            favoriteAccountNumber: '',
            saveAsFavorite: false,
            needToUseLimit: false,
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

    doTransaction = async (useLimit=false) => {
        if(!this.validateForm()) return false

        try {
            const toUser = await UserService.findUser(
                this.state.accountNumber, 
                this.state.name,
                this.state.cpf
            )

            if (!toUser ) {
                throw new Error('target user not found')
            }

            if (this.state.saveAsFavorite) {
                await UserService.addOrUpdateFavorite(this.props.user.id, toUser)
            }

            let rawAmount = this.state.amount.replace(/\./g, '').replace('R$ ', '').replace(',', '.')

            await TransactionService.create(
                this.props.user.id, 
                toUser.id, 
                parseFloat( rawAmount ),
                useLimit,
            )
            this.props.callback()
        }
        catch(e) {
            let errorMessage; 
            if(e.error && e.error.message == "Invalid transaction") {
                errorMessage = 'Esta transação é inválida'
            } else if(e.error && e.error.message == "Need to use limit") {
                // if user has enought limit, but not enought balance, ask if it wants to use the limit
                this.setState({needToUseLimit: true})
            } else if(e.error && e.error.message == "Limit is not enough") {
                errorMessage = 'Seu limite é insuficiente'
            } else if(e && e.message == "target user not found") {
                errorMessage = 'Destinatário não encontrado'
            } else {
                errorMessage = 'Erro ao realizar transação'
            }

            if(errorMessage) toast.error(errorMessage)
        }
    }

    renderLimitConfirmationModal = () => (
        <Modal 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.needToUseLimit}
            onClose={()=>{}}
        >
            <div className={'modal-dialog'} style={{
                position: 'absolute',
                width: 400,
                padding: 20,
                outline: 'none',
                backgroundColor: 'white',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%)`, 
            }}>
                <Typography>É necessário usar seu limite para finalizar esta operação</Typography>
                <Button
                    style={styles.transferButton}
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => this.doTransaction(true)}
                >
                    Transferir
                </Button> 
                <Button
                    style={styles.transferButton}
                    size="large"
                    onClick={() => this.setState({needToUseLimit: false})}
                >
                    Cancelar 
                </Button> 
            </div>
        </Modal >
    )

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
                                this.setState({...this.state, accountNumber: e.target.value})
                            }}
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
                            inputComponent={CpfInput}
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
                            // type="number"
                            onChange={(e) => {
                                this.setState({
                                    ...this.state, 
                                    needToUseLimit: false,
                                    useLimit: false,
                                    amount: e.target.value
                                })}
                            }
                            inputComponent={MoneyInput}
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
            {this.renderLimitConfirmationModal()}
            </Card>
        )
    }
}

export default TransferPage 