import { Service } from './service';

const port = 4900; 
const app = new Service(port);
app.start();