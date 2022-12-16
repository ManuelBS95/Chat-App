import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
	},
})
const PORT = 5000

app.use(cors())

app.get("/", (req, res) => {
	res.send("Chat App")
})

io.on("connection", (socket) => {
	socket.on("message", (message) => {
		// Enviando los eventos
		socket.broadcast.emit("message", {
			body: message,
			from: socket.id,
		})
	})
})

server.listen(PORT, () => {
	console.log("Server is running on port " + PORT)
})
