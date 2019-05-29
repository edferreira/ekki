const SERVER_API = "http://localhost:8000"


export default class FetchService {
    static async post(resource, body) {
        let url = `${SERVER_API}/${resource}`
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            console.log(response)
            if(response.ok)
                return response.json()
            else {
                throw(await response.json())
            }
        } catch (e) {
            throw e
        }
    }

    static async get(resource, filters=undefined) {
        let url = `${SERVER_API}/${resource}`

        if(filters) {
            const query_parameters = JSON.stringify(filters);
            url = url + '?filter=' + query_parameters;
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            try {
                if(response.ok) {
                    return response.json()
                }
                else {
                    throw(await response.json())
                }
            } catch (e) {
                throw e
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}