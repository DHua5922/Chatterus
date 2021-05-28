export default module.exports = (socket: { request: { headers: { cookie: any; }; }; }, next: any) => {
    return next();
    //if (socket.request.headers.cookie) return next();
    //next(new Error('Authentication error'));
};