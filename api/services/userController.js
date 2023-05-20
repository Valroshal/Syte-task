require('dotenv').config();

const User = require('../model/user');
const { TOKEN_KEY } = process.env;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const token = req.headers.authorization || req.query.token || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const newToken = token.slice(7)
    jwt.verify(newToken, TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // If the token is valid, you can access the decoded data in `decoded` object
        req.userId = decoded.user_id;

        next();
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('All inputs are required');
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user._doc.password))) {
            user.token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY, // Replace with your secret key or config variable
                {
                    expiresIn: '2h',
                }
            );

            return res.status(200).json(user);
        }

        return res.status(400).send('Invalid Credentials');
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('All inputs are required');
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send('User Already Exist. Please Login');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        user.token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY, // Replace with your secret key or config variable
            {
                expiresIn: '2h',
            }
        );

        return res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    validateToken,
    login,
    register,
};
