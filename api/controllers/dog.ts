import { IncomingMessage, ServerResponse } from "http"

// Database simulation
const data = [
    {
        id: 1,
        name: "puppe",
        age: 2,
        image: "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_4147.jpg"
    },
    {
        id: 2,
        name: "rekku",
        age: 1,
        image: "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_4147.jpg"
    },
    {
        id: 3,
        name: "lulu",
        age: 12,
        image: "http://localhost:8000/public/lataus.jpeg"
    }
]

export async function getDogs(req: IncomingMessage, res: ServerResponse) {

    res.writeHead(200, { 'Content-Type': 'application/json' })

    res.end(JSON.stringify(data))
}

export async function getDogById(req: IncomingMessage & { params: any }, res: ServerResponse) {

    if (!req?.params?.id) {
        res.writeHead(400, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'required path parameter missing.'
        }))

        return
    }

    const id = Number(req.params.id)

    const dog = data.find(item => item.id === id)

    if (!dog) {
        res.writeHead(404, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'Resource you were requesting does not exist'
        }))

        return
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(dog))
}

export async function createDog(req: IncomingMessage, res: ServerResponse) {


    await new Promise((resolve, reject) => {


        let body = ''

        req.on('data', (data) => {

            body += data

        })

        req.on('end', () => {

            const newDog = JSON.parse(body)

            newDog.id = Math.floor(Math.random() * 1000000)

            data.push(newDog)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(newDog))

            resolve(null)
        })

        req.on('error', reject)
    })
}
