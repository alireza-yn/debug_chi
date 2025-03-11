// import { Socket,Server } from "socket.io";
// import { Main } from "../types/user";

// export const UserSocket = (io:Server)=>{


//     const OnlineDebugers:Main[] = []
//     const user_socket = io.of('/users')


//     user_socket.on('connection',(socket:Socket)=>{
//             socket.on('online_debuger',(user)=>{
//                 if (OnlineDebugers.length == 0){
//                     OnlineDebugers.push(user)
//                 } else {
//                     const find_user = OnlineDebugers.find((item)=> item.uuid == user.uuid)
//                     if (!find_user){
//                         OnlineDebugers.push(user)
//                     }
//                 }
//             })
//     })
// }

import { Socket, Server } from "socket.io";
import { Main } from "../types/user";

export const UserSocket = (io: Server) => {
    const onlineDebuggers = new Map<string, Main>();

    const userSocket = io.of('/online_users');

    userSocket.on('connection', (socket: Socket) => {
        socket.on('online_debuger', (user: Main) => {
            onlineDebuggers.set(user.uuid, {...user,socket_id:socket.id});
            userSocket.emit('new_online_debuger',user)
        });

        socket.on('disconnect', () => {
            onlineDebuggers.forEach((user, uuid) => {
                if (user.socket_id === socket.id) {
                    console.log(user.first_name ,"disconnected")
                    onlineDebuggers.delete(uuid);
                }
            });
        });


        socket.on('get_data',(msg)=>{
            if (msg == "online_debuger"){
                console.log(onlineDebuggers)
                return onlineDebuggers
            }
        })


    });
};

