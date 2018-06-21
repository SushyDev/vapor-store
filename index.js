const {
	BrowserWindow,
	app
} = require("electron");
const path = require("path");
const sass = require("sass");
const fs = require("fs");

const scssPath = path.join(__dirname, "front", "styles.scss");
const cssPath = path.join(__dirname, "front", "styles.css");

const needCompile = (process.argv[2] ? process.argv[2].trim().toLowerCase() == "-c" : false);
const isCompiled = fs.existsSync(cssPath);
const isDebug = (process.argv[2] ? process.argv[2].trim().toLowerCase() == "-d" : false);
const StartOptions = {
	title: "Material Design Components Electron-based App",
	backgroundColor: "#FFF",
	webPreferences: {
		nodeIntegrationInWorker: true,
		defaultFontFamily: {
			standard: "Roboto",
			serif: "Roboto Slab",
			monospace: "Roboto Mono",
			fantasy: "Google Sans"
		},
		defaultFontSize: 14,
		minimumFontSize: 8,
		defaultEncoding: "UTF-8"
	}
};

if(needCompile || !isCompiled) compile(); else launch();

function launch() {
	if(app.isReady()) init(); else app.on("ready", init)
}

function compile() {
	sass.render({
		file: scssPath,
		outFile: cssPath,
		outputStyle: "compressed",
		includePaths: ["node_modules"]
	}, (e, res) => {
		if(e) console.error(e); else 
			fs.writeFile(cssPath, res.css, (e2) => {
				if(e2) console.error(e2); else launch();
			})
	});
}

function init() {
	let main = new BrowserWindow(StartOptions);
	main.loadFile("./front/index.html");
}
