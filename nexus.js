var servers = {
	"JzuTbJe":{type:["General"],	notes:""}, //Uboachan
	"jWb3jUS":{type:["General"],	notes:""}, //Yume Nikki Fan Discord (cool logo)
	"RrDRrmk":{type:["General"],	notes:""}, //Yume Nikki (some tuber)
	"2K9d2aZ":{type:["General"],	notes:""}, //Madosnug's Diary
	"rCgqaSw":{type:["General"],	notes:""}, //Yume Nikki (yuki ona)
	"mrAsM7h":{type:["General"],	notes:""}, //Yumes and Nikkis (cool name)
	"wtBpxrE":{type:["General"],	notes:""}, //Yume Nikki & Fangames
	
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
					notes:	"Welcome to the containment server of the "+
						"containment server, everyone's special "+
						"here."}, 

	"wPBG9S7":{type:["NSFW"],	//Foodies server Yume Kinki
					notes:	"Loli+Shota content "+
						"is included in this server.", warn: 1}, 

	"4KSbxaS":{type:["NSFW"],	notes:	""}, //Spicy YNFG Server
	"AQMVFDh":{type:["LSD"],	notes:	""}, //DreamEmulator
	"s4C2Edd":{type:["LSD"],	notes:	""}, //Emulated Dreams
	"3SBFGGJ":{type:["LSD"],	notes:	""}  //LSD: Dream Emulator Community
}

var categories = {"General": [],"Dev":[],"NSFW": [],"LSD": [],"Total":0}

function loadServer(id) {
	var req = new XMLHttpRequest(), stamp = Math.floor(Date.now()/1000000);
	var cache = localStorage.getItem(stamp+":"+id);
	if(cache) { saveServer(id, cache); return; }

	req.onreadystatechange = function() { 
		if (this.readyState == 4 && this.status == 200) {
			localStorage.setItem(
				stamp+":"+id,
				this.responseText
			);
			saveServer(id, this.responseText);
		} else if(this.readyState == 4 && this.status == 429) {
			setTimeout(
				loadServer,
				JSON.parse(this.responseText).retry_after,
				id);
			document.getElementById("loadtxt").textContent = "Please wait..."
		}
	}
	req.open("GET",
		//"https://jsonp.afeld.me/?url="+
		"https://discordapp.com/api/v6/invites/"+id+"?with_counts=true",
		 true
	); 
	req.send(null);
}

function addElement(parent, type, attributes) {
	if(type == "TEXT")
		var node = document.createTextNode("");
	else	var node = document.createElement(type);

	node = Object.assign(node, attributes);
	parent.appendChild(node);
	return node;
}

function compare(a, b) { return a.active < b.active; }

function saveServer(id, json) {
	var api = JSON.parse(json);
	var info = {
		invite:	id,
		name:	api.guild.name,
		icon:	"https://cdn.discordapp.com/icons/"+api.guild.id+
			"/"+api.guild.icon+".png?size=128",
		count:	api.approximate_member_count,
		active:	api.approximate_presence_count,
		notes:	servers[id].notes,
		type:	servers[id].type,
		warn:	servers[id].warn,
	}
	categories[info.type[0]].push(info);
	document.getElementById("loadtxt").textContent = "Loading "+
		Math.round(categories.Total / Object.keys(servers).length * 100) + "%";
	if(++categories.Total != Object.keys(servers).length) return;
	document.querySelector("#loading").style.display = "none";
	for(var i in categories) {
		if(i == "Total") continue;
		categories[i].sort(compare);
		for(var j in categories[i]) {
			displayServer(categories[i][j]);
		}
	}
}

function displayServer(info) {
	var server = addElement(document.body,"DIV", {className:"server"})
	addElement(server, "IMG", {src: info.icon, width: 96, className: "icon"});
	addElement(server, "BR", {});
	addElement(server, "B", {textContent: info.name, className: "name"});

	var sub = addElement(server, "DIV", {className: "info"});
	addElement(sub, "DIV", {className: "circle on"});
	addElement(sub, "TEXT", {textContent: " "+info.active+" Online"});
	addElement(sub, "DIV", {className: "circle"});
	addElement(sub, "DIV", {className: "circle off"});
	addElement(sub, "TEXT", {textContent: " "+info.count+" Members"});
	addElement(sub, "P", {});

	var invite = addElement(sub, "a", {href:"https://discord.gg/"+info.invite});
	addElement(invite, "DIV", {className:"join",textContent:"Join"});

	var notes = addElement(sub, "DIV", {className:"notes"});
	addElement(notes, "B", {textContent:"Category: "});
	addElement(notes, "TEXT", {textContent: info.type.join(", ")});
	addElement(notes, "BR", {});
	if(info.notes.length > 0) {
		var note = addElement(notes, "B", {
			textContent:(info.warn)?"Warning: ":"Notes: "
		});
		var text = addElement(notes, "FONT", {textContent: info.notes});
		if(info.warn) {
			note.style.color = 
			text.style.color = '#f44336';
		}
		addElement(notes, "BR", {});
	}

	document.querySelector("#list").appendChild(server);
}

window.onload = function(){
	var i = 0; for(var id in servers)
	setTimeout(loadServer, i++*100*Math.random(), id);
}
