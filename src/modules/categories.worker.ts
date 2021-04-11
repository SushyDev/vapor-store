const ctx: Worker = self as any;
ctx.addEventListener('message', async (event) => {
    const games: object = event.data.games;

    for (let [i, game] of Object.entries(games)) {
        try {
            const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
            const returned = await request.json();
            game = {...game, metadata: returned.results[0]};
            ctx.postMessage(JSON.stringify(game));
        } catch (err) {
            // ! It is normal for some errors to happen here
        }
    }
});
