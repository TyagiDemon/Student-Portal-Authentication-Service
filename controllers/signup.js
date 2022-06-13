const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const exchange = require("../lib/queue.js");

const userSignup = async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 12);

		const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
			expiresIn: "1d",
		});

		const newUser = await User.create({
			email: req.body.email,
			password: hashedPassword,
			name: req.body.name,
			tempToken: token,
		});

		await newUser.save();

		await exchange.publish(
			{
				email: req.body.email,
				subject: "Welcome! Activate your account",
				text: `Hello, please activate your account using the following link: https://student-portal-auth-service.herokuapp.com/emailVerify/${token}`,
			},
			{ key: "mail_queue" }
		);

		res
			.status(201)
			.json({ newUser, token, message: "Account not yet activated" });
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

module.exports = userSignup;
