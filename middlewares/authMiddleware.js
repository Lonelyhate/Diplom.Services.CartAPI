const jwt = require("jsonwebtoken");
const jwtDecoded = require("jwt-decode");
const Response = require("../model/Response");

module.exports = function (req, res, next) {
    if (req.method == "OPTIONS") {
    }
    const response = new Response();
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            response.StatusCode = 401;
            response.isSuccess = false;
            response.displayMessage = "Пользователь не авторизован";
            return res.status(401).json(response);
        }

        const decoded = jwtDecoded(token);
        const user = {
            id: decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
        };
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        response.StatusCode = 401;
        response.isSuccess = false;
        response.displayMessage = "Пользователь не авторизован";
        response.ErrorMessage = e;
        return res.status(401).json(response);
    }
};
