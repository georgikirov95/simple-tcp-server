const net = require("net")
const fs = require("fs/promises")
const path = require("path")

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 })

let fileHandler = null
let fileStream = null

socket.on("connect", async () => {
    console.log("Connected!")

    const filePath = process.argv[2]
    const fileName = path.basename(filePath)

    try {
        fileHandler = await fs.open(filePath)
    } catch (error) {
        console.error("Failed to open file:", err)
        socket.destroy()
        return
    }
    socket.write(`FILENAME: ${fileName}*****`)

    fileStream = fileHandler.createReadStream()
    fileStream.on("data", (data) => {
        if (!socket.write(data)) {
            fileStream.pause()
        }
    })

    fileStream.on("end", async () => {
        console.log("File uploaded successfully!")
        await fileHandler.close()
        socket.end()
    })
})

socket.on("drain", () => {
    fileStream.resume()
})

socket.on('error', (err) => {
    console.log("Connection failed")
    console.error(err)
})