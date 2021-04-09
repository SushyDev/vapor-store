// !#Gets gameinfo by name
const getGameByName = (gameName: string) => fetch(`https://api.rawg.io/api/games?search=${gameName}`);
// !#Fetches steamgriddb data
// ? First gets game by name
// ? Then use the id fetched from the name to search the cover by id
// ? then return both arrays that are fetched from the steamgriddb
exports.fetch = (name: string) => getGameByName(name).then((nameResult: any) => (nameResult.results[0] ? nameResult.results[0] : {...nameResult.results[0], url: '../img/game-cover.png'}));

// # Fetch some extra data
exports.fetchExtra = (gameID: string) => fetch(`https://api.rawg.io/api/games/${gameID}`);
