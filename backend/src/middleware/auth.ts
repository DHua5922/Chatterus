import TokenService from "../service/TokenService";

export default module.exports = function(req: any, res: any, next: any) {   
    try {
        TokenService.decryptToken(TokenService.getAccessTokenInRequest(req));
        next();
    } catch(e) {
        console.error(e);
        res.status(401).send({ message: "Invalid token" });
    }
};
