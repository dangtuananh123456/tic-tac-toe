
const SetHeaderToken  = (req, res, next) => {
    req.headers.token = req.cookies.tokenRefresh
    next();
}

module.exports = SetHeaderToken;