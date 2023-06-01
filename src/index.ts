import { Service } from './service';

const port = 3000; 
const app = new Service(port);
app.start();