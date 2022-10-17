const table = document.getElementById("tablebody");

function createNode(element) {
    return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
    return parent.appendChild(el); // Append the second parameter(element) to the first one
}

let input = document.getElementById("searchbar");
let index = document.getElementById("filters");

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params.index != undefined) {
    index.value = params.index;
    searchbar.value = params.query;
    document.getElementById("searchbtn").click();
}

// Enter to search...
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchbtn").click();
    }
});

// Settings

async function toggleSettings() {
    document.getElementById("settings").classList.toggle("hidden");
}

ls = window.localStorage;
if (ls.getItem("Settings") === null) {
    let payload = {
        pvp: document.getElementById("excludePVP").checked
    };
    let settings = JSON.stringify(payload);
    console.log(settings);
    ls.setItem("Settings", settings);
}

let savedSettings = JSON.parse(ls.getItem("Settings"));
document.getElementById("excludePVP").checked = savedSettings.pvp;

async function saveSettings() {
    let payload = {
        pvp: document.getElementById("excludePVP").checked
    };
    let settings = JSON.stringify(payload);
    console.log(settings);
    return ls.setItem("Settings", settings);
}

// The Great Rewrite

function cleanTable() {
    document.getElementById("content").innerHTML = "";
}

async function fetchXIVAPI(url) {
    let response = await fetch(url);
    let results = await response.json();
    return results;
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

function searchAction() {
    cleanTable();
    let filter = index.value;
    let string = document.getElementById("searchbar").value;
    console.log(filter, string);
    urlSearchParams.set("index", filter);
    urlSearchParams.set("query", string);
    console.log(urlSearchParams.toString());
    window.history.replaceState(
        "",
        "",
        `${location.pathname}?${urlSearchParams}`
    );

    switch (filter) {
        case "Action": {
            let actionHeaders = [
                "ID",
                "Name",
                "Icon",
                "HR Icon",
                "CooldownGroup",
                "AdditionalCooldownGroup"
            ];
            let url = `https://xivapi.com/search?string=${string}&indexes=action&columns=Name,ID,Icon,IconHD,CooldownGroup,AdditionalCooldownGroup,IsPvP`;

            // Create Table Headers.
            tableStart(actionHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((action) => {
                    // Exclude pvp actions
					let settings = JSON.parse(ls.getItem('Settings'))
                    if (settings.pvp === true) {
                        if (action.IsPvP === 1) {
                            return;
                        }
                    }

                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        idlink = createNode("a"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img"),
                        cdg = createNode("td"),
                        acdg = createNode("td");

                    idlink.href = `https://xivapi.com/action/${action.ID}`;
                    idlink.innerHTML = action.ID;
                    name.innerHTML = action.Name;
                    icon.src = `https://xivapi.com${action.Icon}`;
                    iconhd.src = `https://xivapi.com${action.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;
                    cdg.innerHTML = action.CooldownGroup;
                    acdg.innerHTML = action.AdditionalCooldownGroup;

                    // Append
                    append(id, idlink);
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(tr, cdg);
                    append(tr, acdg);
                    append(tbody, tr);
                });
            });
            break;
        }
        case "Trait": {
            string = document.getElementById("searchbar").value;
            let traitHeaders = ["ID", "Name", "Icon", "HR Icon"];
            let url = `https://xivapi.com/search?string=${string}&indexes=trait&columns=Name,ID,Icon,IconHD`;

            // Create Table Headers.
            tableStart(traitHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((trait) => {
                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img");

                    id.innerHTML = trait.ID;
                    name.innerHTML = trait.Name;
                    icon.src = `https://xivapi.com${trait.Icon}`;
                    iconhd.src = `https://xivapi.com${trait.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;

                    // Append
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(tbody, tr);
                });
            });
            break;
        }
        case "Status": {
            string = document.getElementById("searchbar").value;
            let statusHeaders = ["ID", "Name", "Icon", "HR Icon"];
            let url = `https://xivapi.com/search?string=${string}&indexes=status&columns=Name,ID,Icon,IconHD`;

            // Create Table Headers.
            tableStart(statusHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((status) => {
                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img");

                    id.innerHTML = status.ID;
                    name.innerHTML = status.Name;
                    icon.src = `https://xivapi.com${status.Icon}`;
                    iconhd.src = `https://xivapi.com${status.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;

                    // Append
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(tbody, tr);
                });
            });
            break;
        }
        case "Item": {
            string = document.getElementById("searchbar").value;
            let itemHeaders = ["ID", "Name", "Icon", "HR Icon"];
            let url = `https://xivapi.com/search?string=${string}&indexes=item&columns=Name,ID,Icon,IconHD`;

            // Create Table Headers.
            tableStart(itemHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((item) => {
                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img");

                    id.innerHTML = item.ID;
                    name.innerHTML = item.Name;
                    icon.src = `https://xivapi.com${item.Icon}`;
                    iconhd.src = `https://xivapi.com${item.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;

                    // Append
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(tbody, tr);
                });
            });
            break;
        }
        case "Mount": {
            string = document.getElementById("searchbar").value;
            let mountHeaders = ["ID", "Name", "Icon", "HR Icon", "IconSmall"];
            let url = `https://xivapi.com/search?string=${string}&indexes=mount&columns=Name,ID,Icon,IconHD,IconSmall`;

            // Create Table Headers.
            tableStart(mountHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((mount) => {
                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img"),
                        iconsmalltd = createNode("td"),
                        iconsmall = createNode("img");

                    id.innerHTML = mount.ID;
                    name.innerHTML = mount.Name;
                    icon.src = `https://xivapi.com${mount.Icon}`;
                    icon.style = "width: 30%;";
                    iconhd.src = `https://xivapi.com${mount.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;
                    iconhd.style = "width: 30%;";
                    iconsmall.src = `https://xivapi.com${mount.IconSmall}`;

                    // Append
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(iconsmalltd, iconsmall);
                    append(tr, iconsmalltd);
                    append(tbody, tr);
                });
            });
            break;
        }
        case "Minion": {
            string = document.getElementById("searchbar").value;
            let minionHeaders = ["ID", "Name", "Icon", "HR Icon", "IconSmall"];
            let url = `https://xivapi.com/search?string=${string}&indexes=companion&columns=Name,ID,Icon,IconHD,IconSmall`;

            // Create Table Headers.
            tableStart(minionHeaders);
            let tbody = document.getElementById("table-content");

            // Fetch data and begin building table
            fetchXIVAPI(url).then((data) => {
                data.Results.map((minion) => {
                    // Create Elements
                    let tr = createNode("tr"),
                        id = createNode("td"),
                        name = createNode("td"),
                        icontd = createNode("td"),
                        icon = createNode("img"),
                        iconhdtd = createNode("td"),
                        iconhd = createNode("img"),
                        iconsmalltd = createNode("td"),
                        iconsmall = createNode("img");

                    id.innerHTML = minion.ID;
                    name.innerHTML = minion.Name;
                    icon.src = `https://xivapi.com${minion.Icon}`;
                    icon.style = "width: 30%;";
                    iconhd.src = `https://xivapi.com${minion.Icon.replace(
                        /\.[^/.]+$/,
                        ""
                    )}_hr1.png`;
                    iconhd.style = "width: 30%;";
                    iconsmall.src = `https://xivapi.com${minion.IconSmall}`;

                    // Append
                    append(tr, id);
                    append(tr, name);
                    append(icontd, icon);
                    append(tr, icontd);
                    append(iconhdtd, iconhd);
                    append(tr, iconhdtd);
                    append(iconsmalltd, iconsmall);
                    append(tr, iconsmalltd);
                    append(tbody, tr);
                });
            });
            break;
        }
    }
}
