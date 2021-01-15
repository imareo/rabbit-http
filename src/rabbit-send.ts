require('dotenv').config({path: __dirname + '/../.env'})
import rabbitRequest from './services/request'


type datasetType = {
    "eventPersonAttendanceId": string
    "personId": string
    "studentId": string
    "presenceType": string
    "eventId": string
    "courseUnitRealizationId": string
}

const ROUTING_KEY = process.env.ROUTING_KEY

const HOST = process.env.HOST
const PORT = process.env.PORT

const VHOST = process.env.VHOST
const EXCHANGE = process.env.EXCHANGE_SEND
const PATH = process.env.PATH_SEND_BEGIN! + VHOST + '/' + EXCHANGE + process.env.PATH_SEND_END!

const USER = process.env.USER_NAME
const PASS = process.env.USER_PASS

const dataset: datasetType = JSON.parse(process.env.DATASET!)
const myHeader = JSON.parse(process.env.MY_HEADER!)

const url = `http://${HOST}:${PORT}${PATH}`
const authRequestData = 'Basic ' + Buffer.from(USER + ":" + PASS).toString('base64')

const presenceType = [
    'CLEARED',
    'PRESENT',
    'ABSENT'
]

const randomIndex = () => Math.floor(Math.random() * 3)

const payloadData = (index: number) => {
    dataset.presenceType = presenceType[index]
    return JSON.stringify(dataset)
}
const requestBody = (index: number) => JSON.stringify({
    "properties": {"headers": myHeader},
    "routing_key": ROUTING_KEY,
    "payload": payloadData(index),
    "payload_encoding": "string"
})

if (process.argv.length !== 3) {
    console.log('Use: node rabbit-send.js packets_number');
    process.exit(0);
} else {
    const [packets] = process.argv.slice(2);
    const numPackets = Number(packets)
    for (let i = 0; i < numPackets; i++) {
        rabbitRequest(url, 'POST', requestBody(randomIndex()), authRequestData)
    }
}
