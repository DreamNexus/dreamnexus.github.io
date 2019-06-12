var servers = {
	"JzuTbJe":{type:["General"],	notes:""}, //Uboachan
	"jWb3jUS":{type:["General"],	notes:""}, //Yume Nikki Fan Discord (cool logo)
	"RrDRrmk":{type:["General"],	notes:""}, //Yume Nikki (some tuber)
	"rCgqaSw":{type:["General"],	notes:""}, //Yume Nikki (yuki ona)
	"mrAsM7h":{type:["General"],	notes:""}, //Yumes and Nikkis (cool name)
	"wtBpxrE":{type:["General"],	notes:""}, //Yume Nikki & Fangames
	"btv7VuW":{type:["General"],	notes:""}, //Madosnug Server
	
	"FBkcd9k":{type:["General"],	//Yume 2kki
					notes:	"The official Yume 2kki server."},

	"uXeAj4Z":{type:["General",],	//Yume Nikki CZ/SK
					notes:	"Czech/Slovakian Yume Nikki Community."}, 

	"ZSMrjVq":{type:["Dev"],	//Dream Diary Development
					notes:	"Dream Diary Development chat, the "+
						"chat for making Yume Nikki fangames, "+
						"general games, and hanging out!"}, 

	"FvRMxkJ":{type:["Dev"],	//Dream Diary Jam 3
					notes:	"A server dedicated to the annual "+
						"Dream Diary Jam."},
 
	"XQNR4Ns":{type:["General"],	//Speedrunning in the 90s
					notes:	"A server dedicated to Yume Nikki "+
						"Speedrunning."},

	"ZBdfJHB":{type:["Dev"],	//Patchy Illusion Team
					notes:	"This server is for active members of "+
						"the team. If people are interested in "+
						"helping you're more than welcome to join."}, 

	"27yCwTF":{type:["NSFW"],	//Uboachan offshoot
					notes: "May have content NSFW.", warn: 1}, 

	"wPBG9S7":{type:["NSFW"],	//Foodies server Yume Kinki
					notes: "May have content NSFW.", warn: 1},
					//Warning regarding loli/shota was removed as 
					//there are no reports of such content on the server.

	"AQMVFDh":{type:["LSD: Dream Emulator"],	notes:	""}, //DreamEmulator
	"s4C2Edd":{type:["LSD: Dream Emulator"],	notes:	""}, //Emulated Dreams
	"3SBFGGJ":{type:["LSD: Dream Emulator"],	notes:	""}  //LSD: Dream Emulator Community
}

var categories = {"General":[],"Dev":[],"NSFW":[]};
var serversLoaded = 0;

//loadServer(id)
//Takes in an server invite code, and sends a request for information.
//e.g loadServer( "JzuTbJe" )

if(localStorage.expiry != Math.floor(Date.now()/1000000)) {
	localStorage.clear();
	localStorage.expiry = Math.floor(Date.now()/1000000);
}

function loadServer(id) {
	var req = new XMLHttpRequest();
	var cache = localStorage[id];
	if(cache) {
		saveServer(cache);
		return;
	}

	req.onreadystatechange = function() { 
		if (this.readyState == 4 && this.status == 200) {
			localStorage[id] = this.responseText;
			saveServer(this.responseText);
		} else if(this.readyState == 4 && this.status == 429) {
			var error = JSON.parse(this.responseText)
			if(error.code == 10006) {	//Unknown Invite
				delete servers[id];
				console.log(
						"Invite: "+id+", is incorrect or expired!\n"+
						"Please update or remove this invite!\n\n"
				);
			} else if(error.retry_after) {	//Rate limited
				setTimeout(
					loadServer,
					JSON.parse(this.responseText).retry_after,
					id
				);
				document.getElementById("loadtxt").textContent = "Please wait..."
			}
		}
	}
	req.open("GET",
		//"https://jsonp.afeld.me/?url="+
		"https://discordapp.com/api/v6/invites/" + id + "?with_counts=true",
		 true
	); 
	req.send(null);
}

//addElement(parent, nodeName, attributes)
//This creates a HTML element and appends it to parent element
//e.g(1) var link = addElement( document.body, "A", {href: "https://google.com"})
//The line above will create <a href="https://google.com"> in the document.body
//e.g(2) addElement( link, "TEXT", "Google!")
//This will add into the element, <a href="https://google.com">Google!</a>

function addElement(parent, type, attributes) {
	if(type == "TEXT")
		var node = document.createTextNode("");
	else
		var node = document.createElement(type);

	node = Object.assign(node, attributes);
	parent.appendChild(node);
	return node;
}

//compare(a, b)
//This compares which server is more online or not.
//This is a helper function for .sort()

function compare(a, b) { return a.active < b.active; }

//saveServer(json)
//This takes in the API response and formats it.
//The result is then pushed into it's respective category
//This function checks whether loading is complete.

function saveServer(json) {
	var api = JSON.parse(json);
	var info = {
		invite:	api.code,
		name:	api.guild.name,
		icon:	"https://cdn.discordapp.com/icons/" + api.guild.id +
			"/" + api.guild.icon + ".png?size=128",
		count:	api.approximate_member_count,
		active:	api.approximate_presence_count,
		notes:	servers[api.code].notes,
		type:	servers[api.code].type,
		warn:	servers[api.code].warn,
	}

	if(!categories[info.type[0]]) categories[info.type[0]] = [];
	categories[info.type[0]].push(info);

	document.getElementById("loadtxt").textContent = "Loading "+
		Math.round(serversLoaded / Object.keys(servers).length * 100) + "%";

	if(++serversLoaded != Object.keys(servers).length) return;

	document.querySelector("#loading").style.display = "none";
	for(var i in categories) {
		categories[i].sort(compare);
		for(var j in categories[i]) {
			displayServer(categories[i][j]);
		}
	}
}

//displayServer(info)
//This function is called by saveServer once loading is complete
//This function will display the box with server information

function displayServer(info) {
	var server = addElement(document.body,"DIV", {className:"server"})
	addElement(server, "IMG", {src: info.icon, width: 96, className: "icon"});
	addElement(server, "BR", {});
	addElement(server, "B", {textContent: info.name, className: "name"});

	var sub = addElement(server, "DIV", {className: "info"});
	addElement(sub, "DIV", {className: "circle on"});
	addElement(sub, "TEXT", {textContent: " " + info.active + " Online"});
	addElement(sub, "DIV", {className: "circle"});
	addElement(sub, "DIV", {className: "circle off"});
	addElement(sub, "TEXT", {textContent: " " + info.count + " Members"});
	addElement(sub, "P", {});

	var invite = addElement(sub, "a", {href:"https://discord.gg/" + info.invite});
	addElement(invite, "DIV", {className:"join",textContent:"Join"});

	var notes = addElement(sub, "DIV", {className: "notes"});
	addElement(notes, "B", {textContent: "Category: "});
	addElement(notes, "TEXT", {textContent: info.type.join(", ")});
	addElement(notes, "BR", {});
	if(info.notes) {
		var note = addElement(notes, "B", {
			textContent: (info.warn) ? "Warning: ":"Notes: "
		});
		var text = addElement(notes, "FONT", {textContent: info.notes});
		if(info.warn) {
			note.style.color = text.style.color = '#f44336';
		}
		addElement(notes, "BR", {});
	}

	document.querySelector("#list").appendChild(server);
}

window.onload = function(){
	var i = 0;
	for(var id in servers) {
		setTimeout(
			loadServer,
			i++ * Math.random() * 100, 
			id
		);
	}
}
