const jackrabbit = require("jackrabbit");
const dotenv = require("dotenv");
dotenv.config();

const rabbit = jackrabbit(process.env.QUEUE_URL);
const exchange = rabbit.default();

// exchange.publish({ data }, { key: key });

module.exports = exchange;
