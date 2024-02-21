import net from 'net'






const server = net.createServer((c) => {

  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });

  c.write(`
HTTP/1.1 666 Hell yeah!
Content-Type: text/html; charset=utf-8
  



  <html><body>ok</body></html>`)
  c.end()
});

server.on('error', (err) => {
  throw err;
});


server.listen(8124, () => {
  console.log('server bound');
}); 