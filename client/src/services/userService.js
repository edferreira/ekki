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
        return JSON.parse(await localStorage.getItem('user'))
    }

    static async getTransactions(userId) {
        const filter = {"where": {"or": [{"to.id": userId}, {"from.id": userId}]}}
        const res = await FetchService.get('transactions', filter)
        console.log(res)
        return res
    }

    static async loadFavorites(userId) {
        const res = await FetchService.get(`users/${userId}`)
        console.log(res)
        return res.favorites
    }
}