import { createWriteStream, createReadStream } from 'fs'
import {rename, unlink} from 'fs/promises'
import {createInterface} from 'readline'
import { EOL } from 'os';

const data = "1,jksndksnjc, ksjdnckjsndc, ksdjnksjndc\n2,dskjnckjsndk,skjdnckjsndc,skjdnckjsdnc\n3,sdcsdc,sdcsdcs,sdcsc"


function readLineFromBuffer(buffer, id) {
    const start = buffer.indexOf(Buffer.from(id))

    buffer.copyWithin(0, start)

    const end = buffer.indexOf(Buffer.from('\n'))
    return buffer.toString('utf8', 0, end - 1)
}


function writeBuffer(buffer) {
    const wr = createWriteStream('test.data',{flags:'a'})

   


    wr.write(buffer)
    

    wr.end()
}

async function updateCsvRow(filePath, rowId, newData) {
    const tempFilePath = filePath + '.tmp';
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(tempFilePath);
    const rl = createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
  
    let found = false;
  
    for await (const line of rl) {
      const columns = line.split(',');
      if (columns[0] === rowId) {
        // Found the row to update
        found = true;
        writeStream.write(newData + EOL); // Replace with the new data
      } else {
        writeStream.write(line + EOL);
      }
    }
  
    writeStream.close();
    readStream.close();
  
    if (found) {
      // Replace original file with updated temp file
      await rename(tempFilePath, filePath);
    } else {
      // Cleanup: remove temp file if rowId not found
      await unlink(tempFilePath);
    }
  }

  updateCsvRow('test.csv', "1", '1,John,Doe,john.doe@example.com,666-0100')
/* function updateRow(){


}

const buffer = Buffer.from(data)
const buffer2 = Buffer.from(data)


const line = readLineFromBuffer(buffer, "3")

console.log(line)

writeBuffer(buffer) */