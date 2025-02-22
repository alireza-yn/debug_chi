import { Server, Socket } from "socket.io";

import Redis from "ioredis"
import { channel } from "diagnostics_channel";


const redis = new Redis()

const trendSocket = (io:Server)=>{
    io.on('connection',(socket:Socket)=>{
        console.log("user connected in trend",socket.id)
        socket.on('trend',(data)=>{
            console.log(data)
            redis.set('hi','hello django')

            
        })

        socket.on('get',(data)=>{
            redis.get("hi").then(result => console.log(result));
        })


        redis.subscribe('new_bid')
        redis.on("message",(channel,message:any)=>{
            if (channel === "new_bid") {
                console.log("New bid received:", message);
                io.emit("new_bid_notification", message);
            }
        })
        redis.subscribe('new_trend')
        redis.on("message",(channel,message)=>{
            if (channel === 'new_trend'){
                console.log("New bid received:", message);
                io.emit("new_trend_notification", message);

            }
        })
    })

}



export default trendSocket