export default interface ClientToServerEvents {
    signUp: (params: {username: string, password: string}) => void;
    signIn: (params: {username: string, password: string}) => void;
    joinRoom: (params: {roomName: string}) => void;
}
