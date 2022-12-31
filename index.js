import axios from "axios"
import regex from "./regex.js"

import { exec } from "child_process"
import { promisify } from "util"
const run = promisify(exec)

const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID || "EKw2COF69dor1ouPVbkxglStk9ZPEI1s"

const main = async (link) => {
    const matchers = {}
    matchers["link"] = regex.link.exec(link)
    if(!matchers.link) {
        throw Error("⛔ Malformed soundcloud link provided...")
    }

    try {
        const { data: html } = await axios.get(link)
        
        matchers["url"] = regex.url.exec(html)
        matchers["track"] = regex.track.exec(html)
        
        if(!matchers.url || !matchers.track) {
            throw Error("⛔ Unable to find metadata in page source code...")
        }

        const { data: file } = await axios.get(`${matchers.url[1]}?client_id=${SOUNDCLOUD_CLIENT_ID}&track_authorization=${matchers.track[1]}`)

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

main(process.argv[2])

