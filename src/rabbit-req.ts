require('dotenv').config({path: __dirname + '/../.env'})
export {}
const fetch = require('node-fetch')


const HOST = process.env.HOST
const PORT = process.env.PORT

const VHOST = process.env.VHOST
const QUEUES = process.env.QUEUES_REQ
const PATH = process.env.PATH_REQ_BEGIN! + VHOST + '/' + QUEUES + process.env.PATH_REQ_END!

const USER = process.env.USER_NAME
const PASS = process.env.USER_PASS

const url = `http://${HOST}:${PORT}${PATH}`
const auth = Buffer.from(USER + ":" + PASS).toString('base64')

const data = (messages: number) => JSON.stringify({
    "count": messages,
    "ackmode": "ack_requeue_true",
    "encoding": "auto"
})

function checkStatus(res: any) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw Error(res.statusText);
    }
}

const rabbitRequest = (messages: number) => fetch(url, {
    method: 'POST',
    body: data(messages),
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    }
})
    .then(checkStatus)
    .then((res: any) => res.json())
    .then((json: JSON) => console.dir(json, {depth: null}))
    .catch((err: Error) => console.log(err))

if (process.argv.length !== 3) {
    console.log('Use: node rabbit-req.js message_number');
    process.exit(0);
} else {
    const [packets] = process.argv.slice(2);
    const numMessage = Number(packets)
    rabbitRequest(numMessage).then()
}
