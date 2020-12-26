function addSteamInstalled() {
    //Credits: https://github.com/GigaJunky/SteamManifests
    function getSteamInstalled() {
        //Steam Manifests Data by BitJunky 2020-03-29
        const {readFileSync, readdirSync, writeFileSync} = require('fs'),
            os = require('os'),
            WIN = os.platform() === 'win32';
        let bp = WIN ? ['C:/Program Files (x86)/Steam'] : [os.homedir + '/.local/share/Steam'], //change path here if you did not install Steam in defaults os=Win/Lin
            bifs = getBasePaths(),
            sa = [];
        bifs.forEach((p, i) => {
            let fs = readdirSync(p + '/steamapps');
            for (const f of fs) {
                var mfd = readMF(p + '/steamapps/' + f, i);
                if (mfd && mfd.appid !== '?') sa.push(mfd);
            }
        });

        function getVal(mf, tag) {
            const res = `"${tag}"\\s*"(.*)"`,
                p = mf.match(new RegExp(res, 'g'));
            if (!p) return '?';
            let j = p[0].match(new RegExp(res));
            return j[1];
        }

        function getBasePaths() {
            const cfg = readFileSync(bp[0] + '/steamapps/libraryfolders.vdf').toString();
            let m = cfg.match(/.*"\d{1,2}".*/g);
            for (let l of m) {
                let p = l.match(/"(\d)"(?:\s*)"(.*)"/);
                if (p) bp.push(p[2].replace(/\\\\/g, '/'));
            }
            return bp;
        }

        function readMF(path, i) {
            if (!path.endsWith('.acf')) return null;
            let mf = readFileSync(path).toString();
            let ps = ['appid', 'installdir', 'SizeOnDisk', 'LastUpdated'];
            let r = {path: WIN ? bifs[i][0] : i};
            for (const p of ps) {
                r[p] = getVal(mf, p);
                //if(p === 'LastUpdated') r[p] = new Date(r[p] * 1000).toISOString().replace('T',' ').substr(0,19)
            }
            return r;
        }

        return [bifs.map((s, i) => ({id: i, path: s})), sa];
    }

    var file = path.join(appDataPath, '/Json/library.json');
    fs.readFile(file, 'utf-8', (err, data) => {
        var array;
        try {
            array = JSON.parse(data);
        } catch (e) {
            array = {list: []};
        }
        var updatedArray = array;

        (async () => {
            var done = 0;
            var total = 0;
            getSteamInstalled()[1].forEach(async (game) => {
                total++;
                getSteamInstalled()[0].forEach(async (dir) => {
                    if (dir.path.startsWith(game.path)) {
                        //Check if already in list
                        let inList = false;
                        updatedArray['list'].forEach((arrayItem) => {
                            if (arrayItem.folder == game.installdir) inList = true;
                        });
                        if (inList) return;

                        $.get(`https://store.steampowered.com/api/appdetails/?appids=${game.appid}`, (gameInfo) => {
                            let gameName;
                            try {
                                gameName = gameInfo[game.appid].data.name;
                            } catch (e) {
                                gameName = game.installdir;
                            }
                            const installedDir = path.join(dir.path, 'steamapps/common', game.installdir);
                            const folderName = game.installdir;
                            updatedArray['list'].push({
                                name: gameName,
                                directory: installedDir,
                                folder: folderName,
                                steam: true,
                            });
                            done++;
                            if (done == total) {
                                saveList();
                            }
                        });
                    }
                });
            });
            function saveList() {
                fs.writeFile(file, JSON.stringify(updatedArray), function (err) {
                    if (err) throw err;
                    if (isDev) console.log('Saved!');
                });
            }
        })();
    });
}
if (!isDev) addSteamInstalled();