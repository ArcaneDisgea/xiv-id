const Headers = {
	Action: ["ID", "Name", "Icon", "HR Icon", "CooldownGroup", "AdditionalCooldownGroup"],
	Trait: ["ID", "Name", "Icon", "HR Icon"],
	Status: ["ID", "Name", "Icon", "HR Icon"],
	Item: ["ID", "Name", "Icon", "HR Icon"],
	Mount: ["ID", "Name", "Icon", "HR Icon", "Journal Icon", "Journal Icon HR"],
	Companion: ["ID", "Name", "Icon", "HR Icon", "Journal Icon", "Journal Icon HR"],
	Map: ["ID", "Name", "Icon"],
	Emote: ["ID", "Name", "Icon", "HR Icon"]
};

const ls = window.localStorage;
// Functions to get data

async function GetData(Index, Field, SearchString) {
	let response;
	let results;
	let newResults;
	switch (Index) {
		case "Action":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Name,Icon,IsPvP,CooldownGroup,AdditionalCooldownGroup`);
			results = await response.json();
			return results;
		case "Trait":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Name,Icon`);
			results = await response.json();
			return results;
		case "Status":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Name,Icon`);
			results = await response.json();
			return results;
		case "Item":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Name,Icon`);
			results = await response.json();
			return results;
		case "Mount":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Singular,Icon`);
			results = await response.json();
			newResults = [];
			for (const mount of results.results) {
				let JournalIcons = GetJournalIcon(mount.fields.Icon, Index);
				mount.fields.Icon = JournalIcons;
				newResults.push(mount);
			}
			results.results = newResults;
			return results;
		case "Companion":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Singular,Icon`);
			results = await response.json();
			newResults = [];
			for (const minion of results.results) {
				let JournalIcons = GetJournalIcon(minion.fields.Icon, Index);
				minion.fields.Icon = JournalIcons;
				newResults.push(minion);
			}
			results.results = newResults;
			return results;
		case "Map":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=PlaceName.Name,Id`);
			results = await response.json();
			return results;
		case "Emote":
			response = await fetch(`https://v2.xivapi.com/api/search?sheets=${Index}&query=${Field}~"${SearchString}"&fields=Name,Icon`);
			results = await response.json();
			return results;
	}
}

async function GetExtraData(Sheet, RowID) {
	let response = await fetch(`https://v2.xivapi.com/api/sheet/${Sheet}/${RowID}`);
	let results = await response.json();
	return results;
}

function GetJournalIcon(Value, Index) {
	switch (Index) {
		case "Mount":
			if (Value.path.includes("/004")) {
				Value.JournalIconPath = Value.path.replaceAll("/004", "/068");
			}
			if (Value.path.includes("/008")) {
				Value.JournalIconPath = Value.path.replaceAll("/008", "/077");
			}

			if (Value.path.includes("/004")) {
				Value.JournalIconPath_hr1 = Value.path_hr1.replaceAll("/004", "/068");
			}
			if (Value.path.includes("/008")) {
				Value.JournalIconPath_hr1 = Value.path_hr1.replaceAll("/008", "/077");
			}
			return Value;
		case "Companion":
			if (Value.path.includes("/004")) {
				Value.JournalIconPath = Value.path.replaceAll("/004", "/068");
			}
			if (Value.path.includes("/008")) {
				Value.JournalIconPath = Value.path.replaceAll("/008", "/077");
			}

			if (Value.path.includes("/004")) {
				Value.JournalIconPath_hr1 = Value.path_hr1.replaceAll("/004", "/068");
			}
			if (Value.path.includes("/008")) {
				Value.JournalIconPath_hr1 = Value.path_hr1.replaceAll("/008", "/077");
			}
			return Value;
	}
}

function GetIcon(Path) {
	return `https://v2.xivapi.com/api/asset/${Path}?format=png`;
}

function GetInputs() {
	let Inputs = {
		SearchBar: document.getElementById("searchbar"),
		Index: document.getElementById("filters"),
		TableBody: document.getElementById("tablebody"),
		SearchButton: document.getElementById("searchbtn"),
		SettingsWindow: document.getElementById("settings"),
		SettingsToggle: document.getElementById("settings-toggle"),
		CloseSettings: document.getElementById("close-settings"),
		SaveSettings: document.getElementById("save-settings"),
		PVPToggle: document.getElementById("excludePVP"),
		Table: document.getElementById("content"),
	};
	return Inputs;
}

const Inputs = GetInputs();

Inputs.SettingsToggle.addEventListener("click", (e) => {
	e.preventDefault();
	toggleSettings();
});

Inputs.CloseSettings.addEventListener("click", (e) => {
	e.preventDefault();
	toggleSettings();
});

Inputs.SaveSettings.addEventListener("click", (e) => {
	e.preventDefault();
	saveSettings();
});

Inputs.SearchBar.addEventListener("keyup", (e) => {
	e.preventDefault();
	if (e.code === "Enter") {
		searchAction();
	}
});

Inputs.SearchButton.addEventListener("click", (e) => {
	e.preventDefault();
	searchAction();
});

// get search params

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params.index != undefined) {
	Inputs.Index.value = params.index;
	Inputs.SearchBar.value = params.query;
	searchAction();
}

// worlds most useless function
function toggleSettings() {
	document.getElementById("settings").classList.toggle("hidden");
}

// settings be like
if (ls.getItem("Settings") === null) {
	let payload = {
		pvp: Inputs.PVPToggle.checked,
	};
	let settings = JSON.stringify(payload);
	console.log(settings);
	ls.setItem("Settings", settings);
}

let savedSettings = JSON.parse(ls.getItem("Settings"));
Inputs.PVPToggle.checked = savedSettings.pvp;

async function saveSettings() {
	let payload = {
		pvp: Inputs.PVPToggle.checked,
	};
	let settings = JSON.stringify(payload);
	searchAction();
	return ls.setItem("Settings", settings);
}

function createNode(element) {
	return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
	return parent.appendChild(el); // Append the second parameter(element) to the first one
}

function cleanTable() {
	document.getElementById("content").innerHTML = "";
}

async function tableStart(headersArray) {
	let table = document.getElementById("content");
	let thead = createNode("thead"),
		tbody = createNode("tbody"),
		tr = createNode("tr");
	tbody.id = "table-content";
	append(table, thead);
	append(thead, tr);
	append(table, tbody);
	headersArray.map((header) => {
		let th = createNode("th");
		th.innerHTML = header;
		th.scope = "col";
		append(tr, th);
	});
}

async function makeTable(Index, Data) {
	await tableStart(Headers[Index]);
	let tbody = document.getElementById("table-content");
	Data.results.map((entry) => {
		// filter pvp actions if exclude pvp is set
		let settings = JSON.parse(ls.getItem("Settings"));
		if (settings.pvp === true) {
			if (entry.fields.IsPvP === true) {
				return;
			}
		}
		// console.log(entry);
		// Create Elements
		let tr = createNode("tr"),
			id = createNode("td"),
			idlink = createNode("a"),
			name = createNode("td"),
			icontd = createNode("td"),
			icon = createNode("img"),
			iconhdtd = createNode("td"),
			iconhd = createNode("img");

		// idlink.href = `https://xivapi.com/action/${action.ID}`;
		idlink.href = `https://v2.xivapi.com/api/sheet/${Index}/${entry.row_id}`;
		idlink.innerHTML = entry.row_id;
		name.innerHTML = entry.fields.Name;
		if (Index != "Map") {
			icon.src = GetIcon(entry.fields.Icon.path);
			iconhd.src = GetIcon(entry.fields.Icon.path_hr1);
		}

		// Append
		append(id, idlink);
		append(tr, id);
		append(tr, name);
		append(icontd, icon);
		append(tr, icontd);
		append(iconhdtd, iconhd);
		append(tr, iconhdtd);
		append(tbody, tr);

		// index specific data
		switch (Index) {
			case "Action":
				let cdg = createNode("td"),
					acdg = createNode("td");
				cdg.innerHTML = entry.fields.CooldownGroup;
				acdg.innerHTML = entry.fields.AdditionalCooldownGroup;
				append(tr, cdg);
				append(tr, acdg);
				break;
			case "Trait":
				break;
			case "Status":
				break;
			case "Item":
				break;
			case "Mount":
				let mjitd = createNode("td"),
					mjihdtd = createNode("td"),
					mji = createNode("img"),
					mjihd = createNode("img");
				mji.src = GetIcon(entry.fields.Icon.JournalIconPath);
				mjihd.src = GetIcon(entry.fields.Icon.JournalIconPath_hr1);

				name.innerHTML = entry.fields.Singular;

				append(mjitd, mji);
				append(mjihdtd, mjihd);
				append(tr, mjitd);
				append(tr, mjihdtd);
				break;
			case "Companion":
				let jitd = createNode("td"),
					jihdtd = createNode("td"),
					ji = createNode("img"),
					jihd = createNode("img");
				ji.src = GetIcon(entry.fields.Icon.JournalIconPath);
				jihd.src = GetIcon(entry.fields.Icon.JournalIconPath_hr1);

				name.innerHTML = entry.fields.Singular;

				append(jitd, ji);
				append(jihdtd, jihd);
				append(tr, jitd);
				append(tr, jihdtd);
				break;
			case "Map":
                name.innerHTML = entry.fields.PlaceName.fields.Name
				icon.src = GetIcon(`/map/${entry.fields.Id}`);
                icon.style = "Width: 20rem; height: auto;"
				break;
		}
	});
}

async function searchAction() {
	cleanTable();
	let Index = Inputs.Index.value;
	let SearchString = Inputs.SearchBar.value;
	let IsPVP = ls.getItem("pvp");

	// set url
	urlSearchParams.set("index", Index);
	urlSearchParams.set("query", SearchString);
	window.history.replaceState("", "", `${location.pathname}?${urlSearchParams}`);

	// GetData(Index, Field, SearchString, IsPVP)
	let data;
	switch (Index) {
		case "Action":
			data = await GetData(Index, "Name", SearchString);
			await makeTable(Index, data);
			break;
		case "Trait":
			data = await GetData(Index, "Name", SearchString);
			await makeTable(Index, data);
			break;
		case "Status":
			data = await GetData(Index, "Name", SearchString);
			await makeTable(Index, data);
			break;
		case "Item":
			data = await GetData(Index, "Name", SearchString);
			await makeTable(Index, data);
			break;
		case "Mount":
			data = await GetData(Index, "Singular", SearchString);
			await makeTable(Index, data);
			break;
		case "Companion":
			data = await GetData(Index, "Singular", SearchString);
			await makeTable(Index, data);
			break;
		case "Map":
			data = await GetData(Index, "PlaceName.Name", SearchString);
			console.log(data);
			await makeTable(Index, data);
			break;
		case "Emote":
			data = await GetData(Index, "Name", SearchString);
			await makeTable(Index, data);
			break;
	}
}
