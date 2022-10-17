const table = document.getElementById("tablebody");

function createNode(element) {
	return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
	return parent.appendChild(el); // Append the second parameter(element) to the first one
}

const xivsearch = "https://xivapi.com/search?string=";

let input = document.getElementById("searchbar");
let index = document.getElementById("filters");

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params.index != undefined) {
	index.value = params.index
	searchbar.value = params.query
	document.getElementById("searchbtn").click();
}

// Enter to search...
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("tablebody").innerHTML = "";
		document.getElementById("searchbtn").click();
	}
});

function createOverlayedAction(action, canvas) {
	let ctx = canvas.getContext('2d');
	let overlayImage = createNode('img'),
		actionImage = createNode('img');
	overlayImage.src = "action-overlay.png";
	actionImage.src = action;
	actionImage.addEventListener('load', e => {
		ctx.drawImage(actionImage, 0, 0, 80, 80, 6, 5, 70, 70);
		ctx.drawImage(overlayImage, 0, 0, 85, 85);
	});
	let overlayedAction = canvas.toDataURL();
	console.log(overlayedAction);
	return overlayedAction
}

// let canvas = document.getElementById('gnashing-fang-hr1')
// createOverlayedAction('https://xivapi.com/i/003000/003410_hr1.png', canvas)

function searchAction() {
	let filter = index.value;
	let string = document.getElementById("searchbar").value;
	console.log(filter, string)
	urlSearchParams.set("index", filter)
	urlSearchParams.set("query", string)
	console.log(urlSearchParams.toString())
	window.history.replaceState('', '', `${location.pathname}?${urlSearchParams}`);
	return searchXIVAPI(string, filter)
}

function searchXIVAPI(string, index) {
	document.getElementById("tablebody").innerHTML = "";
	fetch(xivsearch + string + `&limit=25&indexes=${index}&columns=Name,ID,Icon,IconSmall,IconHD,CooldownGroup,AdditionalCooldownGroup`)
		.then(resp => resp.json())
		.then(function (search) {
			let itemList = search.Results;
			return itemList.map(function (items) {
				let tr = createNode("tr")
				tdicon = createNode("td"),
					iconimg = createNode("img"),
					iconimghd = createNode("img"),
					tdiconhd = createNode("td"),
					tdicon2 = createNode("td"),
					iconimg2 = createNode("img"),
					tdname = createNode("td"),
					tdcdg = createNode("td"),
					tdacdg = createNode("td")
				tdid = createNode("td");
				iconimg.src = `https://xivapi.com${items.Icon}`;
				tdicon.id = `item-icon`
				iconimghd.src = `https://xivapi.com${items.Icon.replace(/\.[^/.]+$/, "")}_hr1.png`;
				// iconimghd.src = createOverlayedAction('https://xivapi.com/i/003000/003410_hr1.png', canvas);
				tdiconhd.id = `hd-icon`
				iconimg2.src = `https://xivapi.com${items.IconSmall}`;
				tdicon2.id = `mount-small-icon`
				tdname.Icon = `${items.Icon}`;
				tdname.innerHTML = `${items.Name}`
				tdname.id = `item-name`
				tdcdg.innerHTML = items.CooldownGroup
				tdacdg.innerHTML = items.AdditionalCooldownGroup
				tdid.innerHTML = `${items.ID}`
				tdid.id = `item-Id`
				append(tdicon, iconimg);
				append(tr, tdicon);
				append(tdiconhd, iconimghd);
				append(tr, tdiconhd);
				append(tdicon2, iconimg2);
				append(tr, tdicon2);
				append(tr, tdname);
				append(tr, tdcdg);
				append(tr, tdacdg);
				append(tr, tdid);
				append(table, tr);
			});
		})
		.catch(function (error) {
			console.log(error);
		});
}


// The Great Rewrite

let string;
let url;

async function fetchXIVAPI(url) {
	let response = await fetch(url);
	let results = await response.json();
	return results;
}

async function tableStart(headersArray) {
	let table = document.getElementById('content');
	let thead = createNode('thead'),
		tbody = createNode('tbody'),
		tr = createNode('tr');
	tbody.id = "table-content"
	append(table, thead);
	append(thead, tr)
	append(table, tbody);
	headersArray.map((header) => {
		let th = createNode('th');
		th.innerHTML = header;
		th.scope = "col";
		append(tr, th);
	})
}


switch (index.value) {
	case "Action":
		string = document.getElementById("searchbar").value;
		let actionHeaders = ['ID', 'Name', 'Icon', 'HR Icon', 'CooldownGroup', 'AdditionalCooldownGroup']
		url = `https://xivapi.com/search?string=${string}&indexes=action&columns=Name,ID,Icon,IconHD,CooldownGroup,AdditionalCooldownGroup`

		// Create Table Headers.
		tableStart(actionHeaders);
		let tbody = document.getElementById("table-content");

		// Fetch data and begin building table
		fetchXIVAPI(url).then(data => {
			data.Results.map((action) => {
				// Create Elements
				let tr = createNode('tr'),
					id = createNode('td'),
					name = createNode('td'),
					icontd = createNode('td'),
					icon = createNode('img'),
					iconhdtd = createNode('td'),
					iconhd = createNode('img'),
					cdg = createNode('td'),
					acdg = createNode('td');

				id.innerHTML = action.ID
				name.innerHTML = action.Name
				icon.src = `https://xivapi.com${action.Icon}`;
				iconhd.src = `https://xivapi.com${action.Icon.replace(/\.[^/.]+$/, "")}_hr1.png`;
				cdg.innerHTML = action.CooldownGroup
				acdg.innerHTML = action.AdditionalCooldownGroup

				// Append
				append(tr, id)
				append(tr, name)
				append(icontd, icon)
				append(tr, icontd)
				append(iconhdtd, iconhd)
				append(tr, iconhdtd)
				append(tr, cdg)
				append(tr, acdg)
				append(tbody, tr)
			})
		})
		break;
	case "Trait":
		string = document.getElementById("searchbar").value;
		let traitHeaders = ['ID', 'Name', 'Icon', 'HR Icon']
		url = `https://xivapi.com/search?string=${string}&indexes=trait&columns=Name,ID,Icon,IconHD`

		// Create Table Headers.
		tableStart(traitHeaders);
		let tbody = document.getElementById("table-content");

		// Fetch data and begin building table
		fetchXIVAPI(url).then(data => {
			data.Results.map((trait) => {
				// Create Elements
				let tr = createNode('tr'),
					id = createNode('td'),
					name = createNode('td'),
					icontd = createNode('td'),
					icon = createNode('img'),
					iconhdtd = createNode('td'),
					iconhd = createNode('img');

				id.innerHTML = trait.ID
				name.innerHTML = trait.Name
				icon.src = `https://xivapi.com${trait.Icon}`;
				iconhd.src = `https://xivapi.com${trait.Icon.replace(/\.[^/.]+$/, "")}_hr1.png`;

				// Append
				append(tr, id)
				append(tr, name)
				append(icontd, icon)
				append(tr, icontd)
				append(iconhdtd, iconhd)
				append(tr, iconhdtd)
				append(tbody, tr)
			})
		})
		break;
	case "Status":
		console.log("Status")
		break;
	case "Item":
		console.log("Item")
		break;
}