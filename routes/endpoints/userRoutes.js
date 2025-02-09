const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passport = require("passport");
const userModel = mongoose.model("User");
const auth = require("../auth");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateLDAP = require("../../validation/ldap");

// Require User model in our routes module
const User = mongoose.model("User");

router.post("/login-ldap", function (req, res, next) {
    //validate user input
    const { errors, isValid } = validateLDAP(req.body);

    //return errors if invalid
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        passport.authenticate("local", { session: false }, (err, passportUser) => {
            if (passportUser) {
                return res.status(200).json(passportUser.toAuthJSON());
            } else {
                return res.status(400).json({ error: "login failed" });
            }
        })(req, res, next);
    }
});

// Defined store route
router.post("/add", function (req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                date: req.body.date,
            });
            // Hash passw
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.log(err));
                });
            });
        }
    });
});

router.post("/login", function (req, res) {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    lastname: user.lastname,
                };
                // Sign token
                jwt.sign(
                    payload,
                    process.env.SECRET_OR_KEY,
                    {
                        expiresIn: 3600, // 1 hour in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// Defined get data(index or listing) route
router.get("/", function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

/* -------------------------------------------------------------------------- */
/*                     Change admin status of anther user                     */
/* -------------------------------------------------------------------------- */

router.post("/changeAdmin", auth.admin, async function (req, res) {
    if (
        (!req.body.hasOwnProperty("userID") || !req.body.hasOwnProperty("userEUID")) &&
        !req.body.hasOwnProperty("action")
    ) {
        res.status(400).json({
            errors: "Must include either user ID or user EUID to change and the action to perform",
        });
    } else {
        var userID, userEUID, action, affectedUser;
        console.log("here");
        try {
            if (req.body.hasOwnProperty("userID")) {
                userID = req.body.userID;
                affectedUser = await userModel.findById(userID);
            } else {
                userEUID = req.body.userEUID;
                console.log(userEUID);
                affectedUser = await userModel.findOne({ euid: userEUID });
                console.log(affectedUser);
            }
            action = req.body.action;
            if (action == "promote") {
                affectedUser.isAdmin = true;
                console.log("here");

                await affectedUser.save();
            } else if (action == "demote") {
                affectedUser.isAdmin = false;
                await affectedUser.save();
            } else {
                throw "invalid action";
            }

            res.status(200).send("user updated");
        } catch (err) {
            if (err == "invalid action") {
                res.status(400).send("Action must be either 'promote' or 'demote'");
            }
        }
    }
});

// Defined delete | remove | destroy route
router.get("/delete/:id", function (req, res) {
    User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
        if (err) res.json(err);
        else res.json(req.params.id);
    });
});

module.exports = router;
