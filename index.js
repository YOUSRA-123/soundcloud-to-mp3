import axios from "axios"
import { exec } from "child_process"
import { promisify } from "util"

const CLIENT_ID = "EKw2COF69dor1ouPVbkxglStk9ZPEI1s"

const linkRegex = /^https:\/\/soundcloud\.com\/.+?\/.+$/g
const urlRegex = /transcodings.+?"url":"(.+?)"/g
const trackRegex = /"track_authorization":"(.+?)"/g

const run = promisify(exec)

const main = async (link) => {
    const linkMatch = linkRegex.exec(link)
    if(!linkMatch) {
        throw Error("⛔ Malformed soundcloud link provided...")
    }

    try {
        const { data: html } = await axios.get(link)
        
        const urlMatch = urlRegex.exec(html)
        const trackMatch = trackRegex.exec(html)
        
        if(!urlMatch || !trackMatch) {
            throw Error("⛔ Unable to find metadata in page source code...")
        }

        const { data: file } = await axios.get(`${urlMatch[1]}?client_id=${CLIENT_ID}&track_authorization=${trackMatch[1]}`)

        const filename = `${link.split("/")[4]}.mp3`
        try {
            await run(`ffmpeg -i "${file.url}" ${filename}`)
        } catch (error) {
            throw Error("⛔ Unable to run ffmpeg", {"cause": error})
        }

        console.log(`✅ You can find the mp3 file here: ${process.cwd()}/${filename}`)
    } catch (error) {
        console.log(error)
    }
}

main("https://soundcloud.com/laytoofficial/ghost-town")

