import FetchService from './fetchService'

export default class TransactionService {
    static async create(from, to, amount) {
        console.log(
            from,
            to,
            amount
        )
        const res = await FetchService.post('transactions', {from, to, amount})
        console.log(res)
        return res
    }
}