const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const exchange = require("../lib/queue.js");

const passwordReset = async (req, res) => {
	try {
		const existingUser = await User.findOne({ email: req.body.email });

		if (!existingUser) {
			throw { status: 404, message: "Account not found" };
		}

		const token = jwt.sign({ email: req.body.email }, existingUser.password, {
			expiresIn: "1d",
		});

		exchange.publish(
			{
				email: existingUser.email,
				subject: "Password reset",
				text: `Hello, use the following link to set your new password. https://student-portal-auth-service.herokuapp.com/setNewPassword/${token}`,
			},
			{ key: "mail_queue" }
		);

		res
			.status(200)
			.json({ token: token, message: "Use this token to reset password" });
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

module.exports = passwordReset;
