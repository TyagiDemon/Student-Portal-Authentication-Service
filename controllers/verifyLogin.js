const jwt = require("jsonwebtoken");
const config = require("../config")[process.env.NODE_ENV || "development"];
const log = config.log();

const verifyLogin = async (req, res) => {
	try {
		log.debug("Verifying login");
		log.debug(`Secret key is ${process.env.SECRET_KEY}`);
		const data = jwt.verify(req.params.token, process.env.SECRET_KEY);
		console.log(data);

		if (!data) {
			throw { status: 400, message: "Invalid token or token may have expired" };
		}

		log.info(`Sending data ${data}`);

		res.status(200).json({ success: true, result: data });
	} catch (err) {
		res
			.status(err.status || 500)
			.json({ success: false, message: err.message || "Something went wrong" });
	}
};

module.exports = verifyLogin;
