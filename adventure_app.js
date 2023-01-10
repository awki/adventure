var app = null;
function app_create () {
app = new application();
}
function application () {
var obfr;
this.terminal_create();
obfr = this.adventure_create();
this.term.tab_expand_array(obfr);
this.term.write(obfr);
this.term.prompt();
}
application.prototype = {
term: null, 
game: null, 
terminal_create: function () {
if ((!this.term) || (this.term.closed)) {
this.term = new Terminal (
{
x: 0,
y: 0,
cols: 72,
ps: '>',
frameWidth: 0,
termDiv: 'termDiv',
bgColor: '#000000',
crsrBlockMode: 'false',
textColor: '#80ff80',
closeOnESC: 'false',
handler: this.term_handler,
initHandler: this.term_init,
exitHandler: this.term_exit
} );
this.term.app = this; 
this.term.tab_expand = (function (str) {
var sf = str.split("\t");
if (sf.length > 1) {
str = [];
var i = 0;
var o = 0;
var n = 0;
while (i < sf.length) {
str = (str + sf[i]);
if ((i+1) < sf.length) {
o += sf[i].length;
n = 8 - o % 8;
o += n;
while (n--)
str = str + " ";
}
i++;
}
}
return str;
} );
this.term.tab_expand_array = (function (stra) {
var i = 0;
while (i < stra.length) {
if (stra[i].indexOf("\t") != -1) {
stra[i] = this.tab_expand(stra[i]);
}
i++;
}
} );
this.term.print = (function (stra) {
this.tab_expand_array(stra);
this.write(stra);
} );
this.term.open();
}
},
term_init: function () {
},
term_exit: function () {
},
term_handler: function () {
var obfr = [];
this.newLine();
if (this.lineBuffer != '') {
if (this.lineBuffer.search(/^\s*cls\s*$/i) == 0) {
this.clear();
}
else if (this.lineBuffer.search(/^\s*restart\s*$/i) == 0) {
this.clear();
auto_reset();
obfr = this.app.adventure_create();
this.print(obfr);
}
else if (this.app.game != null) {
obfr = this.app.game.transform(this.lineBuffer);
this.print(obfr);
}
}
this.prompt();
},
adventure_create: function () {
var obfr = [];
try {
this.game = null;
this.game = new Adventure();
this.game.save_key = "uh5nb2af";
this.game.save_write = (function (key, data) {
try {
if (window.localStorage == null) {
return false;
}
else {
window.localStorage.setItem(key, data);
}
}
catch(ex) {
return false;
}
return true;
} ),
this.game.save_read = (function (key) {
var data = null;
try {
if (window.localStorage == null) {
return null;
}
else {
data = window.localStorage.getItem(key);
}
}
catch(ex) {
return null;
}
return data;
} ),
this.game.setup();
obfr = this.game.start();
}
catch (ex) {
obfr = [];
obfr.push("An exception occurred starting Adventure.");
obfr.push(ex.toString());
obfr.push("Adventure failed. Reload page to try again.");
this.game = null;
}
return(obfr);
},
};
