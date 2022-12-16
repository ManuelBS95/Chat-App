import { useState, useEffect } from "react"
import { io } from "socket.io-client"

const socket = io.connect("http://localhost:5000")

function App() {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState([])

	const handleChange = (e) => {
		e.preventDefault()
		setMessage(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		socket.emit("message", message)
		const newMessage = {
			body: message,
			from: "me",
		}
		setMessages([...messages, newMessage])
		setMessage("")
		e.target.reset()
	}

	useEffect(() => {
		const recievedMessage = (message) => {
			setMessages([
				...messages,
				{
					body: message.body,
					from: message.from,
				},
			])
		}
		socket.on("message", recievedMessage)

		return () => {
			socket.off("message", recievedMessage)
		}
	}, [messages])

	return (
		<div className="bg-[#ECEFF4] flex justify-center items-center h-screen">
			<div className="w-[600px] h-auto bg-[#0E121B] p-[10px] rounded-sm">
				<div className="w-full h-[432px] bg-[#0E121B] mb-[10px] px-2 py-1 overflow-auto">
					{messages.map((msg, index) => (
						<div key={index} className="my-2 px-2 bg-[#171C26] table">
							<div className="text-sm font-bold text-white bg-inherit pt-2 px-1">
								{msg.from}
							</div>
							<div className="text-sm text-white bg-inherit pb-2 px-1">
								{msg.body}
							</div>
						</div>
					))}
				</div>
				<form className="flex flex-row" onSubmit={handleSubmit}>
					<div className="w-full mr-2">
						<input
							className="w-full p-2 bg-[#334155] text-white outline-none rounded-sm text-sm"
							autoComplete="off"
							type="text"
							name="message"
							onChange={handleChange}
						/>
					</div>
					<div className="">
						<button className="w-full px-4 h-full bg-[#3369FF] text-white rounded-sm font-bold text-sm">
							Enviar
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default App
