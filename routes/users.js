var express = require('express');
var router = express.Router();

const User = require('../schemas/users');

// GET all users (query username includes)
router.get('/', async function (req, res) {

    try {

        const { username } = req.query;

        let filter = { isDeleted: false };

        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }

        const users = await User.find(filter).populate('role');

        res.json(users);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// GET user by id
router.get('/:id', async function (req, res) {

    try {

        const user = await User.findOne({
            _id: req.params.id,
            isDeleted: false
        }).populate('role');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// CREATE user
router.post('/', async function (req, res) {

    try {

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });

        await user.save();

        res.status(201).json(user);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// UPDATE user
router.put('/:id', async function (req, res) {

    try {

        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// SOFT DELETE user
router.delete('/:id', async function (req, res) {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

// POST /users/enable
router.post('/enable', async function (req, res) {

    try {

        const { username, email } = req.body;

        const user = await User.findOneAndUpdate(
            { username: username, email: email, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found or info incorrect" });
        }

        res.json({ message: "User enabled", user });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

// POST /users/disable
router.post('/disable', async function (req, res) {

    try {

        const { username, email } = req.body;

        const user = await User.findOneAndUpdate(
            { username: username, email: email, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found or info incorrect" });
        }

        res.json({ message: "User disabled", user });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

module.exports = router;