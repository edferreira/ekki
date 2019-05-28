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
import UserService from '../services/userService';

const styles = { };


class TransferPage extends Component {
    constructor(props) {
        super(props)
        this.state={
            favorite: '',
            favorites: [],
        }
    }

    componentDidMount() {
        this.loadFavorites()
    }

    handleChange(event) {
        this.setState({favorite: event.target.value})
    }

    async loadFavorites() {
        const favorites = await UserService.loadFavorites(this.props.user.id)
        console.log(favorites)
        this.setState({favorites})
    }

    renderFavorites = () => {
        const { favorites } = this.state
        console.log(favorites)
        return (
            favorites.map(favorite => <MenuItem key={favorite.accountNumber} value={favorite.accountNumber}>{`${favorite.accountNumber} - ${favorite.name}`}</MenuItem>)
        )
    }

    render() {
        return (
            <Grid container justify="center">
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="user">Selecionar Favorito</InputLabel>
                    <Select
                        value={this.state.favorite}
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
        )
    }
}

export default TransferPage 