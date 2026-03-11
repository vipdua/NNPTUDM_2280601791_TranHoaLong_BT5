var express = require('express');
var router = express.Router();

const Role = require('../models/Role');
const User = require('../models/User');


// GET all roles (không lấy role đã xoá)
router.get('/', async function (req, res) {

    try {

        const roles = await Role.find({ isDeleted: false });

        res.json(roles);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// GET role by id
router.get('/:id', async function (req, res) {

    try {

        const role = await Role.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json(role);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// POST create role
router.post('/', async function (req, res) {

    try {

        const role = new Role({
            name: req.body.name,
            description: req.body.description
        });

        await role.save();

        res.status(201).json(role);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// PUT update role
router.put('/:id', async function (req, res) {

    try {

        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json(role);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// DELETE role (soft delete)
router.delete('/:id', async function (req, res) {

    try {

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json({ message: "Role deleted successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});


// YÊU CẦU 2
// GET /roles/:id/users
router.get('/:id/users', async function (req, res) {

    try {

        const role = await Role.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        const users = await User.find({
            role: req.params.id,
            isDeleted: false
        });

        res.json(users);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

module.exports = router;