import FetchService from './fetchService'

export default class UserService {
    static async login(userId) {
        try {
            const res = await FetchService.post('login', {id: userId})
            console.log(res)
            localStorage.setItem('user', JSON.stringify(res));
        }
        catch(e) {
            localStorage.setItem('user', null);
            throw e
        }
    }

    static async getUser() {
        const user = JSON.parse(await localStorage.getItem('user'))
        return UserService.findById(user.id)
    }

    static async getTransactions(userId) {
        const filter = {"where": {"or": [{"to": userId}, {"from": userId}]}}
        const res = await FetchService.get('transactions', filter)
        return res
    }

    static async loadFavorites(userId) {
        const res = await FetchService.get(`users/${userId}`)
        return res.favorites
    }

    static async findUser(accountNumber, name, cpf) {
        const filter = {"where": {accountNumber, name, cpf}}
        const res = await FetchService.get(`users`, filter)
        return res.length > 0 ? res[0] : {}
    }

    static async findById(userId) {
        const res = await FetchService.get(`users/${userId}`)
        return res;
    }

    static async addOrUpdateFavorite(userId, newFavorite) {
        const res = await FetchService.post(`users/${userId}/favorite`, newFavorite)
        console.log(res)
    }
}