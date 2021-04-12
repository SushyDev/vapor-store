const ctx: Worker = self as any;
ctx.addEventListener('message', (event) => {
    const games: object = event.data.games;
    const categories: object[] = event.data.categories;

    setInterval(() => ctx.postMessage(categories), 2000);

    setTimeout(() => ctx.postMessage(categories), 1000);

    (async () => {
        for (let [i, game] of Object.entries(games)) {
            try {
                if (!game.name) return;
                const request = await fetch(`https://api.rawg.io/api/games?search=${game.name}`);
                const returned = await request.json();
                game = {...game, metadata: returned.results[0]};
                const index = categories.findIndex((category: any) => category.name == game.metadata.genres[0].name);

                // @ts-ignore
                if (!categories[index].games.find((exist: object) => exist.metadata.id == game.metadata.id)) categories[index].games.push(game);
            } catch (err) {
                // ! It is normal for some errors to happen here
            }
        }
        ctx.postMessage('done');
    })();
});
