const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const routes = require("./routes/user.js");

const app = express();
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const config = require("./config")[process.env.NODE_ENV || "development"];

const log = config.log();

app.get("/", async (req, res) => {
	try {
		res.send("Auth service running");
	}
	catch (err) {
		res.status(500).json({ message: err.message });
	}
})

app.use(routes);

const server = app.listen(process.env.PORT || 4000);

server.on("listening", () => {
  log.info(`Hi there! I'm listening on port ${server.address().port}`);
  
  mongoose.connect(process.env.MONGO_URL, ()=>{log.info("Connected to MongoDB")});

	const registerService = () =>
		axios
			.put(
				`https://student-portal-serviceregistry.herokuapp.com/register/${
					config.name
				}/${config.version}/${server.address().port}`
			)
			.then((res) => log.debug(res.data));
	const unregisterService = () =>
		axios.delete(
			`https://student-portal-serviceregistry.herokuapp.com/register/${
				config.name
			}/${config.version}/${server.address().port}`
		);

	registerService();

	const interval = setInterval(registerService, 240000);
	const cleanup = async () => {
		clearInterval(interval);
		await unregisterService();
	};

	process.on("SIGINT", async () => {
		await cleanup();
		process.exit(0);
	});

	process.on("SIGTERM", async () => {
		await cleanup();
		process.exit(0);
	});

	process
		.on("unhandledRejection", async () => {
			await cleanup();
			process.exit(0);
		})
		.on("uncaughtException", async () => {
			await cleanup();
			process.exit(0);
		});
});
