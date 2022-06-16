const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

const userLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const existingUser = await User.findOne({ email: email }).select(
			"password emailVerified"
		);

		if (!existingUser) {
			throw { status: 404, message: "Account not found" };
		}

		if (!existingUser.emailVerified) {
			throw { status: 404, message: "Please activate your account first" };
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect) {
			throw { status: 400, message: "Incorrect password" };
		}

		const token = jwt.sign(
			{
				id: existingUser._id,
				email: existingUser.email,
			},
			process.env.SECRET_KEY,
			{ expiresIn: "1d" }
		);

		res.status(200).json({ result: existingUser, token });
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

module.exports = userLogin;
