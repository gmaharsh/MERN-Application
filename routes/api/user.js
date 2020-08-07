const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcyrpyt = require('bcryptjs');
const jwt =  require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const config = require('config');

router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Type valid Email').isEmail(),
    check('password', ' Password should be more than 6 characters').isLength({
        min: 6
    }),
] , async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({ email });

        if(user){
            res.status(400).json({
                errors : [ {
                    msg : "User Already exists"
                }]
            });
        }

        const avatar = gravatar.url(email, {
            s : '200',
            r:'pg',
            d:'mn'
        })

        user = new User({
            name,
            email,
            password,
            avatar,
        })

        const salt = await bcyrpyt.genSalt(10);

        user.password = await bcyrpyt.hash(password, salt);

        await user.save();

        const payload =  {
            user : {
                id :  user.name
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn : 3600000
            },
            (err, token) => {
                if(err){
                    throw err;
                }
                res.json({
                    token
                });
            });

    } catch (error) {
        console.log(error.message)
    }



});

module.exports = router;