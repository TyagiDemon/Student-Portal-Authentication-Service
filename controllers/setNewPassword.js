const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User.js");

const setNewPassword = async (req, res) => {
	const token = req.params.passwordResetToken;
	try {
		const isValid = jwt.verify(token, process.env.SECRET_KEY);

		if (isValid) {
			const existingUser = await User.findOne({ email: isValid.email }).select(
				"password"
			);

			if (!existingUser) {
				throw {
					status: 400,
					message: "Invalid token or token may has expired",
				};
			}

			const hashedPassword = await bcrypt.hash(req.body.password, 12);
			existingUser.password = hashedPassword;

			await existingUser.save();
		} else {
			throw { status: 400, message: "Invalid token or token may has expired" };
		}

		res.status(200).json({ message: "Password reset successful" });
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
};

module.exports = setNewPassword;
