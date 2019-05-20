import dotenv from 'dotenv';
import express from 'express';
import bodyPaser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import router from './routes/routes';
import Db from './db/db';

const swaggerDoc = require('../swagger.json');

dotenv.config();

const app = express();
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;

const dbconn = new Db();
app.listen(PORT, (err) => {
	if (err) {
		console.log(`error at port ${PORT}`);
	} else {
		// console.log(dbconn);
		console.log(`CONNECTED at port ${PORT}`);
	}
});
export default app;
