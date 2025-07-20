import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
export interface AuthenticatedSocket extends Socket {
    user?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        accountType: string;
    };
}
export declare const authenticateSocket: (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => void;
export default authenticateSocket;
//# sourceMappingURL=socketAuth.d.ts.map