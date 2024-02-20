

const data = "SOL1,jksndksnjc ksjdnckjsndc ksdjnksjndc,EOL,SOL2,dskjnckjsndk,skjdnckjsndc,skjdnckjsdnc,EOL,SOL3,sdcsdc,sdcsdcs,sdcsc,EOL"


function readLineFromBuffer(buffer, id){
    const start = buffer.indexOf(Buffer.from("SOL" + id))
    
    buffer.copyWithin(0, start)

    const end = buffer.indexOf(Buffer.from('EOL'))
    return buffer.toString('utf8',3,end-1)
}

const buffer = Buffer.from(data)

const line = readLineFromBuffer(buffer, 3)

console.log(line)