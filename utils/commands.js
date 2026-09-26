const fs = require("fs")
const path = require("path")

const SLASH_DIR = path.join(__dirname, "..", "slash")

function loadCommands() {
	return fs
		.readdirSync(SLASH_DIR)
		.filter((file) => file.endsWith(".js"))
		.map((file) => require(path.join(SLASH_DIR, file)))
}

module.exports = { loadCommands }
