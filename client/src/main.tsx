import jwtDecode from 'jwt-decode';
import {io} from 'socket.io-client';

(() => {
    type DecodedUserToken = { userId: number, iat: number, exp: number }
    const userToken = localStorage.getItem('user_token');

    if (userToken == null) {
        location.assign('/login/');
        return;
    }
    const decodedUserToken = jwtDecode<DecodedUserToken>(userToken!);
    if ((decodedUserToken.exp + decodedUserToken.iat) * 1000 < Date.now()) {
        location.assign('/login/');
        return;
    }
    io('/', {
        auth: {
            user_id: +localStorage.getItem('user_id')!,
            house_id: +localStorage.getItem('house_id')!,
            user_token: localStorage.getItem('user_token')!
        },
    });
})();