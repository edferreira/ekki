export default class FetchService {
    static async post(resource, body) {
        try {
            console.log(body)
            const response = await fetch(`http://localhost:8000/${resource}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            if(response.ok)
                return response.json()
            else
                throw(response)
        } catch (e) {
            throw {message: "Erro ao cadastrar usuário", error: e}
        }
    }

    static async get(resource) {
        try {
            const response = await fetch(`http://localhost:8000/${resource}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            try {
                return response.json()
            } catch (e) {
                console.error(e)
                throw e
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}