function gameNameByClass() {
	var gameNameByClass = document.getElementById('game-name-by-class');
	if (gameNameByClass.checked == true) {
		document.getElementById('game-name-by-id').checked = false;
		const e = new Event('change');
		document.getElementById('game-name-by-id').dispatchEvent(e);
		document.getElementById('name-id-div').style.display = 'none';
		document.getElementById('name-class-div').style.display = 'flex';
	} else {
        document.getElementById('name-id-div').style.display = 'none';
        document.getElementById('name-class-div').style.display = 'none';
	}
}

function gameNameByID() {
	var gameNameByUrl = document.getElementById('game-name-by-id');
	if (gameNameByUrl.checked == true) {
		document.getElementById('game-name-by-class').checked = false;
		const e = new Event('change');
		document.getElementById('game-name-by-class').dispatchEvent(e);
		document.getElementById('name-id-div').style.display = 'flex';
		document.getElementById('name-class-div').style.display = 'none';
	} else {
        document.getElementById('name-id-div').style.display = 'none';
        document.getElementById('name-class-div').style.display = 'none';
	}
}

function gameNameRegex() {
	var gameNameRegex = document.getElementById('game-name-regex');
	if (gameNameRegex.checked == true) {
		document.getElementById('name-regex-div').style.display = 'flex';
	} else {
		document.getElementById('name-regex-div').style.display = 'none';
	}
}

function customCover() {
	var customCover = document.getElementById('custom-cover');
	if (customCover.checked == true) {
		document.getElementById('custom-cover-div').style.display = 'flex';
	} else {
		document.getElementById('custom-cover-div').style.display = 'none';
	}
}

function testRegex() {

}