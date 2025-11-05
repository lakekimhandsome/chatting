// server.js
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  // 접속 알림(선택): 클라이언트가 내 socket.id를 알아야 "나" 표시 가능
  socket.emit("connected", { id: socket.id });

  socket.on("chat:msg", (payload) => {
    const msg = {
      id: socket.id, // 발신자 식별(이름 사용 안 함)
      text: String(payload?.text ?? "").slice(0, 2000), // 간단 제한
      ts: Date.now(),
    };
    io.emit("chat:msg", msg); // 모두에게 전파
  });

  socket.on("disconnect", () => {
    // 필요 시 퇴장 이벤트 처리 가능
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
