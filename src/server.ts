import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.IP || '127.0.0.1'

app.all('/', (req: Request, res: Response) => {
  console.log(req.headers, req.query, req.body)
  res.send('Welcome!')
})

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
})