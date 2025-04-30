import { Server, Socket } from "socket.io";
import { getComments, saveComment, saveReply } from "../controllers/comment";

const commentSocket = (io: Server) => {
  // ایجاد یک namespace سفارشی به نام "/trend"
  const commentNamespace = io.of("/comment");

  commentNamespace.on("connection", (socket: Socket) => {
    console.log("User connected in /comment namespace:", socket.id);
    socket.emit(socket.id, {
      msg: "coonected_successfully",
    });
    socket.on("ping", () => {
      console.log("got ping");
      socket.emit("pong", "hey back!");
    });
    socket.on("new_comment", async (data) => {
      const response = await saveComment(data);
      if (response) {
        commentNamespace.emit(data.id, { success: true });
        commentNamespace.emit("new_comment_incomming", data);
      } else {
        commentNamespace.emit(data.id, { success: false });
      }
    });

    socket.on("get_comments", async (comment_id) => {
      const result = await getComments(comment_id);
      socket.emit(comment_id, result);
    });
    socket.on("reply_comment", async (data) => {
      const result = await saveReply(data.comment_id, data.reply);
      socket.emit(data.comment_id, { success: true, result: result });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from /comment: ${socket.id}`);
    });
  });
};

export default commentSocket;
