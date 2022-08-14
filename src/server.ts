import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes/index.routes';

const app: express.Application = express();
const port = config.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', routes);

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome to our store!');
});

app.get('/api', function (req: Request, res: Response) {
  res.send('Welcome to our api!');
});

app.listen(port, function () {
  console.log(`starting app on port: ${port}`);
});

export default app;
