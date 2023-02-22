export default interface ClientToServerEvents {
    signIn: (params: {username: string, password: string}) => void;
    joinRoom: (params: {roomName: string}) => void;
}
