import FetchService from "./fetchService";

export default class TransactionService {
  static async create(from, to, amount, useLimit = false) {
    const res = await FetchService.post("transactions", {
      from,
      to,
      amount,
      useLimit
    });
    return res;
  }
}
