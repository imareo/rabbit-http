require('dotenv').config({path: __dirname + '/../.env'})
import rabbitRequest from './services/request'


const HOST = process.env.HOST
const PORT = process.env.PORT

const VHOST = process.env.VHOST
const QUEUES = process.env.QUEUES_REQ
const PATH = process.env.PATH_REQ_BEGIN! + VHOST + '/' + QUEUES + process.env.PATH_REQ_END!

const USER = process.env.USER_NAME
const PASS = process.env.USER_PASS

const url = `http://${HOST}:${PORT}${PATH}`
const authRequestData = 'Basic ' + Buffer.from(USER + ":" + PASS).toString('base64')

const requestBody = (messages: number) => JSON.stringify({
    "count": messages,
    "ackmode": "ack_requeue_true",
    "encoding": "auto"
})

if (process.argv.length !== 3) {
    console.log('Use: node rabbit-req.js message_number');
    process.exit(0);
} else {
    const [packets] = process.argv.slice(2);
    const numMessage = Number(packets)
    rabbitRequest(url, 'POST', requestBody(numMessage), authRequestData)
}
