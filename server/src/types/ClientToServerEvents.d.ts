export interface ClientToServerEvents {
    signUp: (params: Object) => void;
    signIn: (params: Object) => void;
    joinRoom: (params: {roomName: string}) => void;
}