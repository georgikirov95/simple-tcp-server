const fs = require("fs/promises")
const net = require("net")

const server = net.createServer()

server.on("connection", (socket) => {
    console.log("New connection!")

    let fileHandler = null
    let fileStream = null

    socket.on("data", async (data) => {
        if (fileHandler === null) {
            socket.pause()
            const dataAsString = data.toString("utf-8")
            const delimiter = dataAsString.indexOf("*****")
            const fileName = dataAsString.substring(10, delimiter).trim()

            fileHandler = await fs.open(`./storage/${fileName}`, "w")
            fileStream = fileHandler.createWriteStream()

            fileStream.on("drain", () => {
                socket.resume()
            })

            fileStream.write(data.subarray(delimiter + 5))
            socket.resume()
        } else {
            if (!fileStream.write(data)) {
                socket.pause()
            }
        }
    })

    socket.on("error", async (err) => {
        console.error("Socket error:", err)
        if (fileHandler) await fileHandler.close()
        if (fileStream) fileStream.close()
    })

    socket.on("close", async () => {
        if (fileHandler) await fileHandler.close()
        if (fileStream) fileStream.close()
        console.log("Connection closed!")
    })
})

server.listen(3000, "127.0.0.1", () => {
    console.log("Server running on:", server.address())
})