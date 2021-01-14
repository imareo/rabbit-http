require('dotenv').config({path: __dirname + '/../.env'})
export {}
const fetch = require('node-fetch')


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
const auth = Buffer.from(USER + ":" + PASS).toString('base64')

const presenceType = [
    'CLEARED',
    'PRESENT',
    'ABSENT'
]

const randIndex = () => Math.floor(Math.random() * 3)

const myData = (index: number) => {
    dataset.presenceType = presenceType[index]
    return JSON.stringify(dataset)
}
const data = (index: number) => JSON.stringify({
    "properties": {"headers": myHeader},
    "routing_key": ROUTING_KEY,
    "payload": myData(index),
    "payload_encoding": "string"
})

function checkStatus(res: any) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw Error(res.statusText);
    }
}

const rabbitRequest = (index: number) => fetch(url, {
    method: 'POST',
    body: data(index),
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    }
})
    .then(checkStatus)
    .then((res: any) => res.json())
    .then((json: JSON) => console.log(json))
    .catch((err: Error) => console.log(err))


if (process.argv.length !== 3) {
    console.log('Use: node app.js packets_number');
    process.exit(0);
} else {
    const [packets] = process.argv.slice(2);
    const numPackets = Number(packets)
    for (let i = 0; i < numPackets; i++) {
        rabbitRequest(randIndex()).then()
    }
}
