const jwt = require("express-jwt");
const mongoose = require("mongoose");
const userModel = mongoose.model("User");

/**
 * Grabs the JWT from the request if it exists
 */
const getTokenFromHeaders = (req) => {
    const {
        headers: { authorization },
    } = req;
    if (authorization && authorization.substring(0, 6) === "Bearer") {
        return authorization.substring(6);
    }
    return null;
};

/**
 * Defining actions for authorization
 */
const auth = {
    //Requires auth token to be present
    required: jwt({
        secret: process.env.SECRET_OR_KEY,
        getToken: getTokenFromHeaders,
        algorithms: ["HS256"],
    }),
    //Does not require auth token present,
    //but DOES fill in the req.user property
    //for future use
    optional: jwt({
        secret: process.env.SECRET_OR_KEY,
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
        algorithms: ["HS256"],
    }),
};

/**
 * Wrapping auth.require in a middleware that returns
 * a nicer error to the frontend if the user
 * isnt authorised
 */
var requireLogin = function (req, res, next) {
    auth.required(req, res, function (err) {
        if (err && err.name === "UnauthorizedError") {
            return res.status(401).send("Login again");
        } else {
            return next();
        }
    });
};

/**
 * Require user to be both logged in AND be a site
 * administrator
 */
var requireAdmin = function (req, res, next) {
    auth.required(req, res, function (err) {
        if (err && err.name === "UnauthorizedError") {
            return res.status(401).send("Login again");
        } else {
            /**
             * Check the database (not just the JWT which could be spoofed)
             * to check the admin status of the user
             */
            userModel.findById(req.user.id, function (error, thisUser) {
                if (error) {
                    return res.status(500).send("DB error");
                } else {
                    if (thisUser.isAdmin) {
                        return next();
                    } else {
                        return res.status(402).send("User is not an admin");
                    }
                }
            });
        }
    });
};

/**
 * Wrapper for the optional login
 */
var optionalUser = function (req, res, next) {
    auth.optional(req, res, function (err) {
        return next();
    });
};

module.exports = {
    admin: requireAdmin,
    required: requireLogin,
    optional: optionalUser,
};
