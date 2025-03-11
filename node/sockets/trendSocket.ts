import { Server, Socket } from "socket.io";
import Redis from "ioredis";

const redis = new Redis();

const trendSocket = (io: Server) => {
    // ایجاد یک namespace سفارشی به نام "/trend"
    const trendNamespace = io.of("/trend");

    trendNamespace.on("connection", (socket: Socket) => {
        console.log("User connected in /trend namespace:", socket.id);

        socket.on("trend", (data) => {
            console.log("Received trend data:", data);
            redis.set("hi", "hello django");
        });

        socket.on("get", async () => {
            const result = await redis.get("hi");
            console.log("Stored value:", result);
            socket.emit("trend_response", result);
        });

        // گوش دادن به پیام‌های Redis
        redis.subscribe("new_bid");
        redis.subscribe("new_trend");

        redis.on("message", (channel, message) => {
            if (channel === "new_bid") {
                console.log("New bid received:", message);
                trendNamespace.emit("new_bid_notification", message);
            }
            if (channel === "new_trend") {
                console.log("New trend received:", message);
                trendNamespace.emit("new_trend_notification", message);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected from /trend namespace: ${socket.id}`);
        });
    });
};

export default trendSocket;
