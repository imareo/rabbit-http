const fetch = require('node-fetch')

function checkStatus(res: any) {
    if (res.ok) return res
    console.log(res.status)
    throw Error(res.statusText)
}

export = (url: string, method: 'POST' | 'GET', body: string, auth: string): void => fetch(url, {
    method: method,
    body: body,
    headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Content-Length': body.length,
    }
})
    .then(checkStatus)
    .then((res: any) => res.json())
    .then((json: JSON) => console.dir(json, {depth: null}))
    .catch((err: Error) => console.log(err))
