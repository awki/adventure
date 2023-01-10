function Adventure () {
this._commandCallback = (function(self) {
return function(m) {
self._command(m);
}
})(this);
}
Adventure.prototype = {
gstype: 293424, 
gstime: 0, 
save_key: null,
save_read: null,
save_write: null,
outbfr: [],
blklin: true,
maxtrs: 79,
_stopped: false,
VERSION: "0.0.10r1",
transform: function(text) {
this.outbfr = [];
if (this._stopped == true)
return(this.outbfr);
try {
if (this._callback) {
var cb = this._callback;
this._callback = null;
try {
cb(text);
}
catch (ex) {
this.terminate("An exception occurred processing your input.", ex.toString());
return(this.outbfr);
}
if (!this._callback && !this._stopped) {
this.terminate("A failure occurred processing your input.", "Error. 1500 No callback set by processing.");
}
}
else {
this.terminate("Your input cannot be processed.", "Error. 1510 No callback set.");
}
}
catch (ex) {
this.terminate("An exception occurred processing your input.", ex.toString());
}
return(this.outbfr);
},
terminate: function (msg1, msg2) {
if (msg1)
this.outbfr = [];
this.println("");
if (msg1)
this.println(msg1);
if (msg2)
this.println(msg2);
this.println("Game over. Reload page or type \"restart\" to begin again.");
this.println("");
this._stopped = true;
},
println: function(varargs) {
var m = [];
for (var i = 0; i < arguments.length; i++) {
m.push(arguments[i]);
}
var m = m.join('').split(/\n/);
for (var i = 0; i < m.length; i++) {
if (m[i] == '') {
m[i] = ' ';
}
this.outbfr.push(m[i]);
}
},
toting: function(obj) {
return this.place[obj-1] == -1;
},
here: function(obj) {
return this.place[obj-1] == this.loc || this.toting(obj);
},
at: function(obj) {
return this.place[obj-1] == this.loc || this.fixed[obj-1] == this.loc;
},
liq2: function(pbotl) {
return pbotl == 0 ? this.water :
(pbotl == 2 ? this.oil : 0);
},
liq: function() {
return this.liq2(Math.max(this.prop(this.bottle),-1-this.prop(this.bottle)));
},
liqloc: function(loc) {
var cond = Adventure.cond(loc);
if ((cond & 0x04) != 0) {
return ((cond & 0x02) == 0) ? this.water : this.oil;
} else {
return 0;
}
},
bitset: function(l, n) {
return (Adventure.cond(l) & (1 << n)) != 0;
},
forced: function(loc) {
return Adventure.cond(loc) == 2;
},
dark: function() {
return (Adventure.cond(this.loc) & 1) == 0 && (this.prop(this.lamp) == 0 ||
(!this.here(this.lamp)));
},
pct: function(n) {
return this.ran(100) < n;
},
prop: function(obj) {
if (obj < 1 || obj > 100)
throw Error("1100 Bad object index " + obj);
var p = this._itemProps[obj-1];
return p == null ? 0 : p;
},
setProp: function(obj, value) {
if (obj < 1 || obj > 100)
throw Error("1110 Bad object index " + obj);
return this._itemProps[obj-1] = value;
},
setup: function() {
this.abb = new Array(150);
for (var i = 0; i < this.abb.length; i++) {
this.abb[i] = 0;
}
this.atloc = new Array(150);
for (var i = 0; i < this.atloc.length; i++) {
this.atloc[i] = 0;
}
this.place = new Array(100);
this.fixed = new Array(100);
this.link = new Array(200);
this._itemProps = new Array(64); 
for (var i = 0; i < this._itemProps.length; i++) {
this._itemProps[i] = 0;
}
this.hintlc = new Array(Adventure.HINTS.length);
this.hinted = new Array(Adventure.HINTS.length);
this.tk = new Array(20);
for (var i = 0; i < this.tk.length; i++) { 
this.tk[i] = 0;
}
this.dseen = new Array(6);
this.dloc = new Array(6);
this.odloc = new Array(6);
for (var i = 0; i < 100; i++) {
this.place[i] = 0;
this.link[i] = 0;
this.link[i+100] = 0;
}
for (var i = Adventure.FIXED.length-1; i >= 0; i--) {
if (Adventure.FIXED[i] > 0) {
this.drop(i+101, Adventure.FIXED[i]);
this.drop(i+1, Adventure.PLACE[i]);
}
}
for (var i = 100; i > 0; i--) {
this.fixed[i-1] = Adventure.fixd(i);
if (Adventure.plac(i) != 0 && Adventure.fixd(i) <= 0) {
this.drop(i, Adventure.plac(i));
}
}
this.tally = 0;
this.tally2 = 0;
for (var i = 50; i <= this.maxtrs; i++) {
if (Adventure.PTEXT[i-1] != null) {
this.setProp(i, -1);
this.tally++;
}
}
for (var i = 0; i < this.hinted.length; i++) {
this.hinted[i] = false;
this.hintlc[i] = 0;
}
this.keys = this.vocab("KEYS", 1);
this.lamp = this.vocab("LAMP", 1);
this.grate = this.vocab("GRATE", 1);
this.cage = this.vocab("CAGE", 1);
this.rod = this.vocab("ROD", 1);
this.rod2 = this.rod+1;
this.steps = this.vocab("STEPS", 1);
this.bird = this.vocab("BIRD", 1);
this.door = this.vocab("DOOR", 1);
this.pillow = this.vocab("PILLO", 1);
this.snake = this.vocab("SNAKE", 1);
this.fissur = this.vocab("FISSU", 1);
this.tablet = this.vocab("TABLE", 1);
this.clam = this.vocab("CLAM", 1);
this.oyster = this.vocab("OYSTE", 1);
this.magzin = this.vocab("MAGAZ", 1);
this.dwarf = this.vocab("DWARF", 1);
this.knife = this.vocab("KNIFE", 1);
this.food = this.vocab("FOOD", 1);
this.bottle = this.vocab("BOTTL", 1);
this.water = this.vocab("WATER", 1);
this.oil = this.vocab("OIL", 1);
this.plant = this.vocab("PLANT", 1);
this.plant2 = this.plant+1;
this.axe = this.vocab("AXE", 1);
this.mirror = this.vocab("MIRRO", 1);
this.dragon = this.vocab("DRAGO", 1);
this.chasm = this.vocab("CHASM", 1);
this.troll = this.vocab("TROLL", 1);
this.troll2 = this.troll+1;
this.bear = this.vocab("BEAR", 1);
this.messag = this.vocab("MESSA", 1);
this.vend = this.vocab("VENDI", 1);
this.batter = this.vocab("BATTE", 1);
this.nugget = this.vocab("GOLD", 1);
this.coins = this.vocab("COINS", 1);
this.chest = this.vocab("CHEST", 1);
this.eggs = this.vocab("EGGS", 1);
this.tridnt = this.vocab("TRIDE", 1);
this.vase = this.vocab("VASE", 1);
this.emrald = this.vocab("EMERA", 1);
this.pyram = this.vocab("PYRAM", 1);
this.pearl = this.vocab("PEARL", 1);
this.rug = this.vocab("RUG", 1);
this.chain = this.vocab("CHAIN", 1);
this.back = this.vocab("BACK", 0);
this.look = this.vocab("LOOK", 0);
this.cave = this.vocab("CAVE", 0);
this.wdNull = this.vocab("NULL", 0);
this.entrnc = this.vocab("ENTRA", 0);
this.dprssn = this.vocab("DEPRE", 0);
this.say = this.vocab("SAY", 2);
this.lock = this.vocab("LOCK", 2);
this.wdThrow = this.vocab("THROW", 2);
this.find = this.vocab("FIND", 2);
this.invent = this.vocab("INVEN", 2);
this.chloc = 114;
this.chloc2 = 140;
this.dseen = [ false, false, false, false, false, false ];
this.dflag = 0;
this.dloc = [ 19, 27, 33, 44, 64, this.chloc ];
this.odloc = [0,0,0,0,0,0];
this.daltlc = 18;
this.turns = 0;
this.lmwarn = false;
this.iwest = 0;
this.knfloc = 0;
this.detail = 0;
this.abbnum = 5;
for (var i = 0; i < 4; i++) {
if (Adventure.RTEXT[2*i+81] != null)
this.maxdie = i+1;
}
this.numdie = 0;
this.holdng = 0;
this.dkill = 0;
this.foobar = 0;
this.bonus = 0;
this.clock1 = 30;
this.clock2 = 50;
this.closng = false;
this.panic = false;
this.closed = false;
this.gaveup = false;
this.wizard = false;
this.wzdark = false; 
this.obj = 0; 
},
start: function() {
this.outbfr = [];
this.ran(1);
this.oldloc = 1;
this.loc = 1;
this.newloc = 1;
this.limit = 330;
this._undoTaunt = false;
this.yes(65, 1, 0, function(yea) {
if (yea) {
this.hinted[2] = true;
this.limit = 1000;
}
this._nextTurn();
});
return this.outbfr;
},
_nextTurn: function() {
if (this.newloc < 9 && this.newloc != 0 && this.closng) {
this.rspeak(130);
if (!this.panic) {
this.clock2 = 15;
this.panic = true;
}
}
if (this.newloc != this.loc && (!this.forced(this.loc)) && (!this.bitset(this.loc,3))) {
for (var i = 0; i < 5; i++) {
if (this.odloc[i] == this.newloc && this.dseen[i]) {
this.newloc = this.loc;
this.rspeak(2);
break;
}
}
}
this.loc = this.newloc;
if (this.loc == 0 || this.forced(this.loc) || this.bitset(this.newloc,3)) {
return this._describeLocation();
}
if (this.dflag == 0) {
if (this.loc >= 15) {
this.dflag = 1;
}
return this._describeLocation();
}
if (this.dflag == 1) {
if (this.loc < 15 || this.pct(95)) {
return this._describeLocation();
}
this.dflag = 2;
for (var i = 0; i < 2; i++) {
var j = this.ran(5);
if (this.pct(50))
this.dloc[j] = 0;
}
for (var i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc) {
this.dloc[i] = this.daltlc;
}
this.odloc[i] = this.dloc[i];
}
this.rspeak(3);
this.drop(this.axe, this.loc);
return this._describeLocation();
}
var dtotal = 0;
var attack = 0;
var stick = 0;
var j;
dwarfloop: for (var i = 0; i < 6; i++) {
if (this.dloc[i] != 0) {
j = 0;
var kk = Adventure.TRAVEL_KEY[this.dloc[i]-1];
if (kk >= 0) {
do {
var newloc = (Math.floor(Math.abs(Adventure.TRAVEL[kk])/1000)) % 1000;
if (newloc == 0) {
this.println(" ---- UH OH ----");
this.println("Newloc for dwarf #", i+1, " is 0.");
this.println("Dwarf is currently in " + this.dloc[i] + ", kk=" + kk);
this.println("NOT MOVING DWARF TO AVOID CRASH!");
} else {
if (newloc > 300 || newloc == 15 ||
newloc == this.odloc[i] ||
(j > 0 && newloc == this.tk[j-1]) || j > this.tk.length
|| newloc == this.dloc[i] || this.forced(newloc) ||
(i == 5 && this.bitset(newloc,3)) ||
Math.floor(Math.abs(Adventure.TRAVEL[kk])/1000000) == 100) {
} else {
this.tk[j] = newloc;
j++;
}
}
kk++;
} while (Adventure.TRAVEL[kk-1] >= 0);
}
this.tk[j] = this.odloc[i];
if (j >= 1)
j--;
j = this.ran(j + 1);
this.odloc[i] = this.dloc[i];
this.dloc[i] = this.tk[j];
this.dseen[i] = this.dseen[i] && this.loc >= 15 ||
this.dloc[i] == this.loc || this.odloc[i] == this.loc;
if (this.dseen[i]) {
this.dloc[i] = this.loc;
if (i == 5) {
if (this.loc == this.chloc || this.prop(this.chest) >= 0) {
continue dwarfloop;
}
k = 0;
for (j = 50; j <= this.maxtrs; j++) {
if (j == this.pyram && (this.loc == Adventure.plac(this.pyram)
|| this.loc == Adventure.plac(this.emrald))) {
} else {
this.idondx = j;
if (this.toting(this.idondx)) {
this.rspeak(128); 
if (this.place[this.messag-1] == 0) {
this.move(this.chest, this.chloc); 
}
this.move(this.messag, this.chloc2);
for (j = 50; j <= this.maxtrs; j++) {
if (j == this.pyram && (this.loc == Adventure.plac(this.pyram)
|| this.loc == Adventure.plac(this.emrald))) {
continue;
}
this.idondx = j;
if (this.at(this.idondx) && this.fixed[this.idondx-1] == 0)
this.carry(this.idondx, this.loc);
if (this.toting(this.idondx)) {
this.drop(this.idondx, this.chloc);
}
}
this.dloc[5] = this.chloc;
this.odloc[5] = this.chloc;
this.dseen[5] = false;
continue dwarfloop;
}
}
if (this.here(this.idondx)) {
k = 1;
}
}
if (this.tally == (this.tally2+1) && k == 0 &&
this.place[this.chest-1] == 0 && this.here(this.lamp) &&
this.prop(this.lamp) == 1) {
this.rspeak(186); 
this.move(this.chest, this.chloc);
this.move(this.messag, this.chloc2);
this.dloc[5] = this.chloc;
this.odloc[5] = this.chloc;
this.dseen[5] = false;
continue dwarfloop;
}
if (this.odloc[5] != this.dloc[5] && this.pct(20)) {
this.rspeak(127); 
}
continue dwarfloop;
} else { 
dtotal++;
if (this.odloc[i] != this.dloc[i]) {
continue;
}
attack++;
if (this.knfloc >= 0) {
this.knfloc = this.loc;
}
if (this.ran(1000) < (95*this.dflag-2))
stick++;
}
}
}
}
if (dtotal > 0) {
if (dtotal == 1) {
this.rspeak(4);
} else {
this.println(" There are ", dtotal, " threatening little dwarves in the room with you.");
}
if (attack > 0) {
if (this.dflag == 2)
this.dflag = 3;
if (attack == 1) {
this.rspeak(5);
k = 52;
} else {
this.println(" ", attack, " of them throw knives at you!");
k = 6;
}
if (stick > 1) {
this.println(" ", stick, " of them get you!");
} else {
this.rspeak(k+stick);
}
if (stick > 0) {
this.oldlc2 = this.loc;
return this._died();
}
}
}
this._describeLocation();
},
_describeLocation: function() {
if (this.loc == 0) {
return this._died();
}
var msg = Adventure.SHORT_DESCRIPTIONS[this.loc-1];
if ((this.abb[this.loc-1] % this.abbnum) == 0 || msg == null) {
msg = Adventure.LONG_DESCRIPTIONS[this.loc-1];
}
if ((!this.forced(this.loc)) && this.dark()) {
if (this.wzdark && this.pct(35)) {
return this._fellIntoAPit();
}
msg = Adventure.RTEXT[15];
}
if (this.toting(this.bear)) {
this.rspeak(141);
}
this.speak(msg);
k = 1;
if (this.forced(this.loc)) {
return this._motionVerb(k);
}
if (this.loc == 33 && this.pct(25) && (!this.closng)) {
this.rspeak(8);
}
if (!this.dark()) {
this.abb[this.loc-1]++;
for (var i = this.atloc[this.loc-1]; i != 0; i = this.link[i-1]) {
var obj = i;
if (obj > 100)
obj = obj-100;
if (!(obj == this.steps && this.toting(this.nugget))) {
if (this.prop(obj) < 0) {
if (this.closed) {
continue;
}
this.setProp(obj, 0);
if (obj == this.rug || obj == this.chain) {
this.setProp(obj, 1);
}
this.tally--;
if (this.tally == this.tally2 && this.tally != 0) {
this.limit = Math.min(35, this.limit);
}
}
var kk = this.prop(obj);
if (obj == this.steps && this.loc == this.fixed[this.steps-1])
kk = 1;
this.pspeak(obj, kk);
}
this.blklin = false;
}
this.blklin = true;
}
this._getCommand();
},
_commandSuccess: function() {
return this._commandError(54);
},
_commandError: function(k) {
this.rspeak(k);
return this._getCommand();
},
_getCommand: function() {
this.verb = 0;
this.obj = 0;
return this._hint(0);
},
_hint: function(hint) {
for (hint=Math.max(hint,3); hint < Adventure.HINTS.length; hint++) {
if (!this.hinted[hint]) {
if (!this.bitset(this.loc, hint+1)) {
this.hintlc[hint] = -1;
}
this.hintlc[hint]++;
if (this.hintlc[hint] >= Adventure.HINTS[hint][0]) {
if (this._hintActive(hint)) {
this.hintlc[hint] = 0;
return this.yes(Adventure.HINTS[hint][2], 0, 54, function(yea) {
if (yea) {
this.println(' I am prepared to give you a hint, but it will cost you ',
Adventure.HINTS[hint][1], ' points.');
return this.yes(175, Adventure.HINTS[hint][3], 54, function(yea) {
this.hinted[hint] = yea;
if (this.hinted[hint] && this.limit > 30) {
this.limit += 30*(Adventure.HINTS[hint][1]);
this.hintlc[hint] = 0;
}
return this._hint(hint);
});
} else {
return this._hint(hint);
}
});
}
}
}
}
if (this.closed) {
if (this.prop(this.oyster) < 0 && this.toting(this.oyster)) {
this.pspeak(this.oyster, 1);
}
for (var i = 1; i <= 100; i++) {
if (this.toting(i) && this.prop(i) < 0) {
this.setProp(i, (-1)-this.prop(i));
}
}
}
this.wzdark = this.dark();
if (this.knfloc > 0 && this.knfloc != this.loc) {
this.knfloc = 0;
}
this.ran(1);
this.getin(this._commandCallback);
},
_command: function(m) {
var match = /^(\S+)(?:\s+(\S+))?/.exec(m);
if (match == null) {
this.getin(this._commandCallback);
return;
}
var wd1 = match[1].toUpperCase();
var wd2 = match[2];
if (wd2 != null)
wd2 = wd2.toUpperCase();
this.foobar = Math.min(0, -this.foobar);
if (this.turns == 0 && wd1 == 'MAGIC' && wd2 == 'MODE') {
this.println("Fine, you're a wizard.");
this.wizard = true;
return this._getCommand();
}
this.turns++;
if (wd1 == 'ROLL' && (wd2 == 'DICE' || wd2 == 'DIE')) {
this.println("You roll a " + this.ran(1000) + ".");
return this._getCommand();
}
if (wd1 == 'SUICIDE') {
if (this.wizard) {
this.println("Well, if you say so.");
return this._died();
} else {
this.println("Suicide is only the answer if you are an immortal wizard.");
}
return this._getCommand();
}
if (wd1 == 'UNDO') {
if (this._undoTaunt && this.pct(25)) {
this.speak("Try using Control-Z.");
} else {
this._undoTaunt = true;
this.speak("What do you think this is, the Inform port?");
}
return this._getCommand();
}
if (wd1 == 'RESUME' || wd1 == 'RESTORE' || wd1 == 'LOAD' || wd1 == 'RELOAD') {
return this._resume();
}
if (this.wizard && wd1 == 'FIND' && wd2 == 'EVERYTHING') {
this.println("ATLOC table is:");
for (var i = 0; i < this.atloc.length; i++) {
if (this.atloc[i] != 0) { 
this.println((i+1) + ": " + this.atloc[i]);
}
}
return this._getCommand();
}
if (this.tally == 0 && this.loc >= 15 && this.loc != 33) {
this.clock1--;
}
if (this.clock1 == 0) {
this._caveClosing();
return(this._command_tail(wd1, wd2));
} else {
if (this.clock1 < 0) {
this.clock2--; 
}
if (this.clock2 == 0) {
return this._setupStorageRoom();
}
if (this.prop(this.lamp) == 1) {
this.limit--;
}
if (this.limit <= 30) {
if (this.here(this.batter) && this.prop(this.batter) == 0) {
this.rspeak(188);
this.setProp(this.batter, 1);
if (this.toting(this.batter))
this.drop(this.batter, this.loc);
this.limit += 2500;
this.lmwarn = false;
} else if (this.limit == 0) {
this.limit = -1;
this.setProp(this.lamp, 0);
if (this.here(this.lamp))
this.rspeak(184);
} else if (this.limit < 0 && this.loc <= 8) {
this.rspeak(185);
this.gaveup = true;
return this._endGame();
} else {
if (!this.lmwarn && this.here(this.lamp)) {
this.lmwarn = true;
var spk = 187;
if (this.place[this.batter-1] == 0)
spk = 183;
if (this.prop(this.batter) == 1)
spk = 189;
this.rspeak(189);
}
}
}
}
return this._command_tail (wd1, wd2);
},
_command_tail: function (wd1, wd2) {
var k = 43;
if (this.liqloc(this.loc) == this.water) {
k = 70;
}
if (wd1 == 'ENTER' && wd2 != null && (wd2.substr(0,5) == 'STREA' || wd2 == 'WATER')) {
return this._commandError(k);
}
if (wd1 == 'ENTER' && wd2 != null) {
return this._parseWord(wd2, null);
}
if ((wd1 == 'WATER' || wd1 == 'OIL')
&& (wd2 == 'PLANT' || wd2 == 'DOOR')) {
if (this.at(this.vocab(wd2,1)))
wd2 = 'POUR';
}
if (wd1 == 'WEST') {
this.iwest++;
if (this.iwest == 10) {
this.rspeak(17);
}
}
return this._parseWord(wd1, wd2);
},
_parseWord: function(wd1, wd2) {
var i = this.vocab(wd1, -1);
if (i == -1) {
this._dontUnderstand();
return;
}
var k = i % 1000;
var kq = Math.floor(i/1000);
switch (kq) {
case 0:
this._motionVerb(k);
return;
case 1:
return this._analyseObject(k, wd1, wd2);
case 2:
return this._verb(k, wd1, wd2);
case 3:
this.rspeak(k);
return this._getCommand();
default:
this.bug(22);
}
},
_dontUnderstand: function() {
var spk=60;
if (this.pct(20)) {
spk=61;
}
if (this.pct(20)) {
spk=13;
}
this.rspeak(spk);
this._hint(0);
},
_verb: function(k, wd1, wd2) {
this.verb = k;
this.spk = Adventure.ACTSPK[this.verb-1];
if (wd2 != null && this.verb != this.say) {
return this._parseWord(wd2, null);
}
if (this.verb == this.say) {
this.obj = wd2 == null ? 0 : -1;
}
if (this.obj != 0) {
return this._transitiveVerb(wd1, wd2);
}
return this._intransitiveVerb(wd1, wd2);
},
_intransitiveVerb: function(wd1, wd2) {
switch (this.verb) {
case 1: 
return this._intransTake();
case 2: 
case 3: 
case 9: 
case 10: 
case 16: 
case 17: 
case 19: 
case 21: 
case 28: 
case 29: 
return this._toWhat();
case 4: 
case 6: 
return this._intransLock();
case 5: 
return this._commandSuccess();
case 7: 
return this._lightLamp();
case 8: 
return this._lampOff();
case 11: 
return this._commandError(this.spk);
case 12: 
return this._attack();
case 13: 
return this._pour();
case 14: 
return this._intransEat();
case 15: 
return this._drink();
case 18: 
return this._quit();
case 20: 
return this._inventory();
case 22: 
return this._fill();
case 23: 
return this._blast();
case 24: 
return this._scoreVerb();
case 25: 
return this._foo(wd1);
case 26: 
return this._brief();
case 27: 
return this._readIntrans(wd1);
case 30: 
return this._suspend();
case 31: 
return this._hours();
default:
this.bug(23);
}
},
_transitiveVerb: function(wd1, wd2) {
switch (this.verb) {
case 1: 
return this._take();
case 2: 
return this._drop();
case 3: 
return this._say(wd1, wd2);
case 4: 
case 6: 
return this._lock();
case 5: 
return this._commandSuccess();
case 7: 
return this._lightLamp();
case 8: 
return this._lampOff();
case 9: 
return this._wave();
case 10: 
case 11: 
case 18: 
case 24: 
case 25: 
case 26: 
case 30: 
case 31: 
return this._commandError(this.spk);
case 12: 
return this._attack();
case 13: 
return this._pour();
case 14: 
return this._eat();
case 15: 
return this._drink();
case 16: 
return this._rub();
case 17: 
return this._throw();
case 19: 
case 20: 
return this._find();
case 21: 
return this._feed();
case 22: 
return this._fill();
case 23: 
return this._blast();
case 27: 
return this._read(wd1);
case 28: 
return this._break();
case 29: 
return this._wake();
default:
this.bug(24);
}
},
_analyseObject: function(k, wd1, wd2) {
this.obj = k;
if (this.fixed[k-1] != this.loc && ! this.here(k)) {
if (k == this.grate) {
if (this.loc == 1 || this.loc == 4 || this.loc == 7) {
k = this.dprssn;
}
if (this.loc > 9 && this.loc < 15) {
k = this.entrnc;
}
if (k != this.grate)
return this._motionVerb(k);
}
if (!this._checkObjectHere(k, wd1, wd2)) {
return;
}
}
if (wd2 != null) {
return this._parseWord(wd2, null);
}
if (this.verb != 0) {
return this._transitiveVerb(wd1, wd2);
}
this.println("What do you want to do with the " + wd1 + "?");
return this._hint(0);
},
_checkObjectHere: function(k, wd1, wd2) {
if (k == this.dwarf) {
for (var i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc && this.dflag >= 2) {
return true;
}
}
}
if ((this.liq() == k && this.here(this.bottle)) || k == this.liqloc(this.loc)) {
return true;
}
if (this.obj == this.plant && this.at(this.plant2) && this.prop(this.plant2) != 0) {
this.obj = this.plant2;
return true;
}
if (this.obj == this.knife && this.knfloc == this.loc) {
this.knfloc = -1;
this._commandError(116);
return false;
}
if (this.obj == this.rod && this.here(this.rod2)) {
this.obj = this.rod2;
return true;
}
if ((this.verb == this.find || this.verb == this.invent) && wd2 == null) {
return true;
}
this.println(" I see no " + wd1 + " here.");
this._getCommand();
return false;
},
_motionVerb: function(k) {
if (this.loc < 1 || this.loc >= Adventure.TRAVEL_KEY.length)
this.bug(26);
var kk = Adventure.TRAVEL_KEY[this.loc-1];
this.newloc = this.loc;
if (kk == null) {
this.bug(26);
}
if (k == this.wdNull) {
return this._nextTurn();
} else if (k == this.back) {
k = this.oldloc;
if (this.forced(k)) {
k = this.oldlc2;
}
this.oldlc2 = this.oldloc;
this.oldloc = this.loc;
var k2 = 0;
if (k == this.loc) {
this.rspeak(91);
return this._nextTurn();
}
while (true) {
var ll = (Math.floor(Math.abs(Adventure.TRAVEL[kk])/1000)) % 1000;
if (ll == k) {
return this._motionVerbLabel22(kk);
}
if (ll <= 300) {
var j = Adventure.TRAVEL_KEY[ll-1];
if (this.forced(ll) && (Math.floor(Math.abs(Adventure.TRAVEL[j])/1000) % 1000) == k) {
k2 = kk;
}
}
if (Adventure.TRAVEL[kk] < 0) {
kk = k2;
if (kk == 0) {
this.rspeak(140);
return this._nextTurn();
}
return this._motionVerbLabel22(kk);
}
kk++;
}
} else if (k == this.look) {
if (this.detail < 3) {
this.rspeak(15);
}
this.detail++;
this.wzdark = false;
this.abb[this.loc-1] = 0;
return this._nextTurn();
} else if (k == this.cave) {
this.rspeak(this.loc < 8 ? 57 : 58);
return this._nextTurn();
}
this.oldlc2 = this.oldloc;
this.oldloc = this.loc;
this._motionVerbLabel9(k, kk);
},
_motionVerbLabel22: function(kk) {
return this._motionVerbLabel9(Math.abs(Adventure.TRAVEL[kk]) % 1000,
Adventure.TRAVEL_KEY[this.loc-1]);
},
_motionVerbLabel9: function(k, kk) {
var ll;
while (true) {
ll = Math.abs(Adventure.TRAVEL[kk]);
var lm = ll % 1000;
if (lm == 1 || lm == k) {
break;
}
if (Adventure.TRAVEL[kk] < 0) {
return this._cantGoThatWay(k);
}
kk++;
}
ll = Math.floor(ll / 1000);
while (true) {
this.newloc = Math.floor(ll / 1000);
k = this.newloc % 100;
if (this.newloc <= 300) {
if (this.newloc <= 100) {
if (this.newloc == 0 || this.pct(this.newloc))
break;
} else if (this.toting(k) || this.newloc > 200 && this.at(k)) {
if ((ll % 1000) == 302) {
this.drop(this.emrald, this.loc);
} else {
break;
}
}
} else if (this.prop(k) != (Math.floor(this.newloc/100)-3)) {
break;
}
while (true) {
if (Adventure.TRAVEL[kk] < 0)
this.bug(25);
kk++;
this.newloc = Math.floor(Math.abs(Adventure.TRAVEL[kk])/1000);
if (this.newloc != ll) {
ll = this.newloc;
break;
}
}
}
this.newloc = ll % 1000;
if (this.newloc <= 300)
return this._nextTurn();
if (this.newloc <= 500) {
switch (this.newloc) {
case 301:
this.newloc = 199 - this.loc;
if (this.holdng == 0 || (this.holdng == 1 && this.toting(this.emrald))) {
return this._nextTurn();
}
this.newloc = this.loc;
this.rspeak(117);
return this._nextTurn();
case 302:
throw Error("1130 Oops, special travel 302 dropped through.");
case 303:
if (this.prop(this.troll) == 1) {
this.pspeak(this.troll, 1);
this.setProp(this.troll, 0);
this.move(this.troll2, 0);
this.move(this.troll2+100, 0);
this.move(this.troll, Adventure.plac(this.troll));
this.move(this.troll+100, Adventure.fixd(this.troll));
this.juggle(this.chasm);
this.newloc = this.loc;
return this._nextTurn();
} else {
this.newloc = Adventure.plac(this.troll) + Adventure.fixd(this.troll) - this.loc;
if (this.prop(this.troll) == 0) {
this.setProp(this.troll, 1);
}
if (!this.toting(this.bear)) {
return this._nextTurn();
}
this.rspeak(162);
this.setProp(this.chasm, 1);
this.setProp(this.troll, 2);
this.drop(this.bear, this.newloc);
this.fixed[this.bear-1] = -1;
this.setProp(this.bear, 3);
if (this.prop(this.spices) < 0) {
this.tally2++;
}
this.oldlc2 = this.newloc;
return this._died();
}
}
this.bug(20);
}
this.rspeak(this.newloc-500);
this.newloc = this.loc;
return this._nextTurn();
},
_cantGoThatWay: function(k) {
var spk = 12;
if (k >= 43 && k <= 50)
spk = 9;
if (k == 29 || k == 30)
spk = 9;
if (k == 7 || k == 36 || k == 37)
spk = 10;
if (k == 11 || k == 19)
spk = 11;
if (this.verb == this.find || this.verb == this.invent)
spk = 59;
if (k == 62 || k == 65)
spk = 42;
if (k == 17)
spk = 80;
this.rspeak(spk);
return this._nextTurn();
},
_fellIntoAPit: function() {
this.rspeak(23);
this.oldlc2 = this.loc;
return this._died();
},
_died: function() {
if (this.closng) {
this.rspeak(131);
this.numdie++;
return this._endGame();
}
this.yes(81+(this.numdie*2), 82+(this.numdie*2), 54, function(yea) {
this.numdie++;
if (this.numdie >= this.maxdie || !yea) {
return this._endGame();
}
this.place[this.water-1] = 0;
this.place[this.oil-1] = 0;
if (this.toting(this.lamp)) {
this.setProp(this.lamp, 0);
}
for (var i = 100; i >= 1; i--) {
if (this.toting(i)) {
var k = this.oldlc2;
if (i == this.lamp)
k = 1;
this.drop(i, k)
}
}
this.loc = 3;
this.oldloc = this.loc;
this._describeLocation();
});
},
_toWhat: function() {
this.println("What?");
this.obj = 0;
this._hint(0);
},
_intransTake: function() {
var here = this.atloc[this.loc-1];
if (here == 0 || this.link[here-1] != 0) {
return this._toWhat();
}
for (var i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc && this.dflag >= 2) {
return this._toWhat();
}
}
this.obj = here;
return this._take();
},
_take: function() {
if (this.toting(this.obj)) {
return this._commandError(this.spk);
}
this.spk = 25;
if (this.obj == this.plant && this.prop(this.plant) <= 0) {
this.spk = 115;
}
if (this.obj == this.bear && this.prop(this.bear) == 1) {
this.spk = 169;
}
if (this.obj == this.chain && this.prop(this.bear) != 0) {
this.spk = 170;
}
if (this.fixed[this.obj-1] != 0) {
return this._commandError(this.spk);
}
if (this.obj == this.water || this.obj == this.oil) {
this.obj = this.bottle;
if (this.here(this.bottle) && this.liq() == this.obj) {
} else {
if (this.toting(this.bottle) && this.prop(this.bottle) == 1) {
return this._fill();
}
if (this.prop(this.bottle) != 1) {
this.spk = 105;
}
if (!this.toting(this.bottle)) {
this.spk = 104;
}
return this._commandError(this.spk);
}
}
if (this.holdng >= 7) {
return this._commandError(92); 
}
if (this.obj == this.bird && this.prop(this.bird) == 0) {
if (this.toting(this.rod)) {
return this._commandError(26);
}
if (!this.toting(this.cage)) {
return this._commandError(27);
}
this.setProp(this.bird, 1);
}
if ((this.obj == this.bird || this.obj == this.cage) && this.prop(this.bird) != 0) {
this.carry(this.bird+this.cage-this.obj, this.loc);
}
this.carry(this.obj, this.loc);
if (this.obj == this.bottle) {
var k = this.liq();
if (k != 0) {
this.place[k-1] = -1;
}
}
return this._commandSuccess();
},
_drop: function() {
if (this.toting(this.rod2) && this.obj == this.rod && (!this.toting(this.rod))) { 
this.obj = this.rod2;
}
if (!this.toting(this.obj)) {
return this._commandError(this.spk);
}
if (this.obj == this.bird && this.here(this.snake)) {
this.rspeak(30);
if (this.closed) {
return this._disturbDwarves();
}
this.destroy(this.snake);
this.setProp(this.snake, 1);
} else if (this.obj == this.coins && this.here(this.vend)) {
this.destroy(this.coins);
this.drop(this.batter, this.loc);
this.pspeak(this.batter, 0);
return this._getCommand();
} else if (this.obj == this.bird && this.at(this.dragon) && this.prop(this.dragon) != 0) {
this.rspeak(154);
this.destroy(this.bird);
this.setProp(this.bird, 0);
if (this.place[this.snake-1] == Adventure.plac(this.snake)) {
this.tally2++;
}
return this._getCommand();
} else if (this.obj == this.bear && this.at(this.troll)) {
this.rspeak(163);
this.move(this.troll, 0);
this.move(this.troll+100, 0);
this.move(this.troll2, Adventure.plac(this.troll));
this.move(this.troll2+100, Adventure.fixd(this.troll));
this.juggle(this.chasm);
this.setProp(this.troll, 2);
} else if (this.obj == this.vase) {
if (this.loc == Adventure.plac(this.pillow)) {
this.rspeak(54);
} else {
this.setProp(this.vase, this.at(this.pillow) ? 0 : 2);
this.pspeak(this.vase, this.prop(this.vase)+1);
if (this.prop(this.vase) != 0) {
this.fixed[this.vase-1] = -1;
}
}
}
var k = this.liq();
if (k == this.obj)
this.obj = this.bottle;
if (this.obj == this.bottle && k != 0)
this.place[k-1] = 0;
if (this.obj == this.cage && this.prop(this.bird) != 0) {
this.drop(this.bird, this.loc);
}
if (this.obj == this.bird) {
this.setProp(this.bird, 0);
}
this.drop(this.obj, this.loc);
return this._getCommand();
},
_say: function(wd1, wd2) {
if (wd2 != null)
wd1 = wd2;
var i = this.vocab(wd1, -1);
if (i == 62 || i == 65 || i == 71 || i == 2025) { 
this.obj = 0;
return this._parseWord(wd1, null);
}
this.println(" Okay, " + wd1);
return this._getCommand();
},
_intransLock: function() {
this.spk = 28;
if (this.here(this.clam)) {
this.obj = this.clam;
}
if (this.here(this.oyster)) {
this.obj = this.oyster;
}
if (this.at(this.door)) {
this.obj = this.door;
}
if (this.at(this.grate)) {
this.obj = this.grate;
}
if (this.obj != 0 && this.here(this.chain)) {
return this._toWhat();
}
if (this.here(this.chain)) {
this.obj = this.chain;
}
if (this.obj == 0) {
return this._commandError(this.spk);
}
this._lock();
},
_lock: function() {
if (this.obj == this.clam || this.obj == this.oyster) {
var k = this.obj == this.oyster ? 1 : 0;
var spk = 124 + k;
if (this.toting(this.obj)) {
spk = 120 + k;
}
if (!this.toting(this.tridnt)) {
spk = 122 + k;
}
if (this.verb == this.lock) {
spk = 61;
}
if (spk == 124) {
this.destroy(this.clam);
this.drop(this.oyster, this.loc);
this.drop(this.pearl, 105);
}
return this._commandError(spk);
}
if (this.obj == this.door) {
this.spk = 111;
}
if (this.obj == this.door && this.prop(this.door) == 1) {
this.spk = 54;
}
if (this.obj == this.cage) {
this.spk = 32;
}
if (this.obj == this.keys) {
this.spk = 55;
}
if (this.obj == this.grate || this.obj == this.chain) {
this.spk = 31;
}
if (this.spk != 31 || (!this.here(this.keys))) {
return this._commandError(this.spk);
}
if (this.obj == this.chain) {
if (this.verb == this.lock) {
var spk = 172;
if (this.prop(this.chain) != 0) {
spk = 34;
}
if (this.loc != Adventure.plac(this.chain)) {
spk = 173;
}
if (spk == 172) {
this.setProp(this.chain, 2);
if (this.toting(this.chain)) {
this.drop(this.chain, this.loc);
}
this.fixed[this.chain-1] = -1;
}
return this._commandError(spk);
} else {
var spk = 171;
if (this.prop(this.bear) == 0)
spk = 41;
if (this.prop(this.chain) == 0)
spk = 37;
if (spk == 171) {
this.setProp(this.chain, 0);
this.fixed[this.chain-1] = 0;
if (this.prop(this.bear) != 3) {
this.setProp(this.bear, 2);
}
this.fixed[this.bear-1] = 2-this.prop(this.bear);
}
return this._commandError(spk);
}
}
if (!this.closng) {
var k = 34 + this.prop(this.grate);
this.setProp(this.grate, 1);
if (this.verb == this.lock) {
this.setProp(this.grate, 0);
}
k = k + 2*this.prop(this.grate);
return this._commandError(k);
}
if (!this.panic) {
this.clock2 = 15;
this.panic = true;
}
return this._commandError(130);
},
_lightLamp: function() {
if (!this.here(this.lamp)) {
return this._commandError(this.spk);
}
if (this.limit < 0) {
return this._commandError(184);
}
this.setProp(this.lamp, 1);
this.rspeak(39);
if (this.wzdark) {
this._describeLocation();
} else {
this._getCommand();
}
},
_lampOff: function() {
if (!this.here(this.lamp)) {
return this._commandError(this.spk);
}
this.setProp(this.lamp, 0);
this.rspeak(40);
if (this.dark()) {
this.rspeak(16);
}
this._getCommand();
},
_wave: function() {
if ((!this.toting(this.obj)) && (this.obj != this.rod || (!(this.toting(this.rod2)))))
this.spk = 29;
if (this.obj != this.rod || (!this.at(this.fissur)) || (!this.toting(this.obj)) || this.closng) {
return this._commandError(this.spk);
}
this.setProp(this.fissur, 1-this.prop(this.fissur));
this.pspeak(this.fissur, 2-this.prop(this.fissur));
return this._getCommand();
},
_attack: function() {
var i;
for (i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc && this.dflag >= 2)
break;
}
if (this.obj == 0) {
if (i < 5) {
this.obj = this.dwarf;
}
if (this.here(this.snake)) {
this.obj = this.obj*100+this.snake;
}
if (this.at(this.dragon) && this.prop(this.dragon) == 0) {
this.obj = this.obj*100+this.dragon;
}
if (this.at(this.troll)) {
this.obj = this.obj*100+this.troll;
}
if (this.here(this.bear) && this.prop(this.bear) == 0) {
this.obj = this.obj*100+this.bear;
}
if (this.obj > 100) {
return this._toWhat();
}
if (this.obj == 0) {
if (this.here(this.bird) && this.verb != this.wdThrow) {
this.obj = this.bird;
}
if (this.here(this.clam) || this.here(this.oyster)) {
this.obj = 100*this.obj+this.clam;
}
if (this.obj > 100) {
return this._toWhat();
}
}
}
if (this.obj == this.bird) {
if (this.closed) {
return this._commandError(137);
}
this.destroy(this.bird);
this.setProp(this.bird, 0);
if (this.place[this.snake-1] == Adventure.plac(this.snake)) {
this.tally2++;
}
this.spk = 45;
}
if (this.obj == 0) {
this.spk = 44;
}
if (this.obj == this.clam || this.obj == this.oyster) {
this.spk = 150;
}
if (this.obj == this.snake) {
this.spk = 46;
}
if (this.obj == this.dwarf) {
this.spk = 49;
}
if (this.obj == this.dwarf && this.closed) {
return this._disturbDwarves();
}
if (this.obj == this.dragon) {
this.spk = 167;
}
if (this.obj == this.troll) {
this.spk = 157;
}
if (this.obj == this.bear) {
this.spk = 165 + ((this.prop(this.bear)+1)>>1);
}
if (this.obj != this.dragon || this.prop(this.dragon) != 0) {
return this._commandError(this.spk);
}
this.rspeak(49);
this.verb = 0;
this.obj = 0;
var self = this;
return this.getin(function(m) {
m = m.toUpperCase();
if (m != 'Y' && m != 'YES') {
return self._command(m);
}
self.pspeak(self.dragon, 1);
self.setProp(self.dragon, 2);
self.setProp(self.rug, 0);
var k = (Adventure.plac(self.dragon) + Adventure.fixd(self.dragon)) >> 1;
self.move(self.dragon+100, -1);
self.move(self.rug+100, 0);
self.move(self.dragon, k);
self.move(self.rug, k);
for (var i = 1; i <= 100; i++) {
if (self.place[i-1] == Adventure.plac(self.dragon) ||
self.place[i-1] == Adventure.fixd(self.dragon)) {
self.move(i, k);
}
}
self.loc = k;
return self._motionVerb(self.wdNull);
});
},
_pour: function() {
if (this.obj == this.bottle || this.obj == 0) {
this.obj = this.liq();
}
if (this.obj == 0) {
return this._toWhat();
}
if (!this.toting(this.obj)) {
return this._commandError(this.spk);
}
if (this.obj != this.oil && this.obj != this.water) {
return this._commandError(78);
}
this.setProp(this.bottle, 1);
this.place[this.obj-1] = 0;
if (!(this.at(this.plant) || this.at(this.door))) {
return this._commandError(77);
}
if (this.at(this.door)) {
this.setProp(this.door, 0);
if (this.obj == this.oil) {
this.setProp(this.door, 1);
}
return this._commandError(113 + this.prop(this.door));
}
if (this.obj != this.water) {
return this._commandError(112);
}
this.pspeak(this.plant, this.prop(this.plant)+1);
this.setProp(this.plant, (this.prop(this.plant)+2)%6);
this.setProp(this.plant2, Math.floor(this.prop(this.plant)/2));
return this._motionVerb(this.wdNull);
},
_intransEat: function() {
if (!this.here(this.food)) {
return this._toWhat();
}
this.destroy(this.food);
return this._commandError(72);
},
_eat: function() {
if (this.obj == this.food) {
this.destroy(this.food);
return this._commandError(72);
}
if (this.obj == this.bird || this.obj == this.snake ||
this.obj == this.clam || this.obj == this.oyster ||
this.obj == this.dwarf || this.obj == this.dragon ||
this.obj == this.troll || this.obj == this.bear) {
return this._commandError(71);
}
return this._commandError(this.spk);
},
_drink: function() {
if (this.obj == 0 && this.liqloc(this.loc) != this.water &&
(this.liq() != this.water || !this.here(this.bottle))) {
return this._toWhat();
}
if (this.obj != 0 && this.obj != this.water) {
this.spk = 110;
}
if (this.spk != 110 && this.liq() == this.water &&
this.here(this.bottle)) {
this.setProp(this.bottle, 1);
this.place[this.water-1] = 0;
this.spk = 74;
}
return this._commandError(this.spk);
},
_rub: function() {
if (this.obj != this.lamp)
this.spk = 76;
return this._commandError(this.spk);
},
_throw: function() {
if (this.toting(this.rod2) && this.obj == this.rod && (!this.toting(this.rod))) {
this.obj = this.rod2;
}
if (!this.toting(this.obj)) {
return this._commandError(this.spk);
}
if (this.obj >= 50 && this.obj <= this.maxtrs && this.at(this.troll)) {
this.drop(this.obj, 0);
this.move(this.troll, 0);
this.move(this.troll+100, 0);
this.drop(this.troll2, Adventure.plac(this.troll));
this.drop(this.troll2+100, Adventure.fixd(this.troll));
this.juggle(this.chasm);
return this._commandError(159);
}
if (this.obj == this.food && this.here(this.bear)) {
this.obj = this.bear;
return this._feed();
}
if (this.obj != this.axe) {
return this._drop();
}
for (var i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc) {
if (this.ran(3) == 0) {
return this._throwAxe(48);
}
this.dseen[i] = false;
this.dloc[i] = 0;
this.dkill++;
return this._throwAxe(this.dkill == 1 ? 149 : 47);
}
}
if (this.at(this.dragon) && this.prop(this.dragon) == 0) {
return this._throwAxe(152);
}
if (this.at(this.troll)) {
return this._throwAxe(158);
}
if (this.here(this.bear) && this.prop(this.bear) == 0) {
this.drop(this.axe, this.loc);
this.fixed[this.axe-1] = -1;
this.setProp(this.axe, 1);
this.juggle(this.bear);
return this._commandError(164);
}
this.obj = 0;
return this._attack();
},
_throwAxe: function(spk) {
this.rspeak(spk);
this.drop(this.axe, this.loc);
return this._motionVerb(this.wdNull);
},
_quit: function() {
this.yes(22, 54, 54, function(gaveup) {
if (gaveup) {
this.gaveup = true;
this._endGame();
} else {
this._getCommand();
}
});
},
_find: function() {
if (this.at(this.obj) || (this.liq()==this.obj && this.at(this.bottle)) ||
this.verb == this.liqloc(this.loc)) {
this.spk = 94;
}
for (var i = 0; i < 5; i++) {
if (this.dloc[i] == this.loc && this.dflag >= 2 && this.obj == this.dwarf) {
this.spk = 94;
}
}
if (this.closed) {
this.spk = 138;
}
if (this.toting(this.obj)) {
this.spk = 24;
}
this._commandError(this.spk);
},
_inventory: function() {
var spk = 98;
for (var i = 1; i <= 100; i++) {
if (i != this.bear && this.toting(i)) {
if (spk == 98) {
this.rspeak(99);
}
this.blklin = false;
this.pspeak(i, -1);
this.blklin = true;
spk = 0;
}
}
if (this.toting(this.bear))
spk = 141;
return this._commandError(spk);
},
_feed: function() {
if (this.obj == this.bird) {
return this._commandError(100);
}
if (this.obj == this.snake || this.obj == this.dragon || this.obj == this.troll) {
var spk = 102;
if (this.obj == this.dragon && this.prop(this.dragon) != 0) {
spk = 110;
}
if (this.obj == this.troll) {
spk = 182;
}
if (this.obj == this.snake && !this.closed && this.here(this.bird)) {
spk = 101;
this.destroy(this.bird);
this.setProp(this.bird, 0);
this.tally2++;
}
return this._commandError(spk);
}
if (this.obj == this.dwarf) {
if (!this.here(this.food)) {
return this._commandError(this.spk);
} else {
this.dflag++;
return this._commandError(103);
}
}
if (this.obj == this.bear) {
if (this.prop(this.bear) == 0)
this.spk = 102;
if (this.prop(this.bear) == 3)
this.spk = 110;
if (!this.here(this.food))
return this._commandError(this.spk);
this.destroy(this.food);
this.setProp(this.bear, 1);
this.fixed[this.axe-1] = 0;
this.setProp(this.axe, 0);
return this._commandError(168);
}
return this._commandError(14);
},
_fill: function() {
if (this.obj == this.vase) {
var spk = 29;
if (this.liqloc(this.loc) == 0) {
spk = 144;
}
if (this.liqloc(this.loc) == 0 || !this.toting(this.vase)) {
return this._commandError(spk);
}
this.rspeak(145);
if (this.loc == Adventure.plac(this.pillow)) {
this.rspeak(54);
} else if (this.at(this.pillow)) {
this.setProp(this.vase, 0);
} else {
this.setProp(this.vase, 2);
this.fixed[this.vase-1] = -1;
}
this.drop(this.vase, this.loc);
return this._getCommand();
} else {
if (this.obj != 0 && this.obj != this.bottle) {
return this._commandError(this.spk);
}
if (this.obj == 0 && !(this.here(this.bottle))) {
return this._toWhat();
}
var spk = 107;
if (this.liqloc(this.loc) == 0) {
spk = 106;
}
if (this.liq() != 0) {
spk = 105;
}
if (spk == 107) {
this.setProp(this.bottle, Adventure.cond(this.loc) & 2);
var k = this.liq();
if (this.toting(this.bottle)) {
this.place[k-1] = -1;
}
if (k == this.oil) {
spk = 108;
}
}
return this._commandError(spk);
}
},
_blast: function() {
if (this.prop(this.rod2) < 0 || !this.closed) {
return this._commandError(this.spk);
}
this.bonus = 133;
if (this.loc == 115) {
this.bonus = 134;
}
if (this.here(this.rod2)) {
this.bonus = 135;
}
this.rspeak(this.bonus);
return this._endGame();
},
_scoreVerb: function() {
this._score(true);
return this.yes(143, 54, 54, function(yea) {
this.gaveup = yea;
if (yea) {
return this._endGame();
} else {
return this._getCommand();
}
});
},
_foo: function(wd1) {
var k = this.vocab(wd1, 3);
var spk = 42;
if (this.foobar == (1-k)) {
this.foobar = k;
if (k != 4) {
return this._commandSuccess();
}
this.foobar = 0;
if (this.place[this.eggs-1] == Adventure.plac(this.eggs) ||
this.toting(this.eggs) && this.loc == Adventure.plac(this.eggs)) {
return this._commandError(spk);
}
if (this.place[this.eggs-1] == 0 && this.place[this.troll-1] == 0 && this.prop(this.troll) == 0) {
this.setProp(this.troll, 1);
}
k = 2;
if (this.here(this.eggs)) {
k = 1;
}
if (this.loc == Adventure.plac(this.eggs)) {
k = 0;
}
this.move(this.eggs, Adventure.plac(this.eggs)); 
this.pspeak(this.eggs, k);
return this._getCommand();
}
if (this.foobar != 0) {
spk = 151;
}
return this._commandError(spk);
},
_brief: function() {
this.abbnum = 10000;
this.detail = 3;
return this._commandError(156);
},
_readIntrans: function(wd1) {
if (this.here(this.magzin)) {
this.obj = this.magzin;
}
if (this.here(this.tablet)) {
this.obj = this.obj*100 + this.tablet;
}
if (this.here(this.messag)) {
this.obj = this.obj*100 + this.message;
}
if (this.closed && this.toting(this.oyster)) {
this.obj = this.oyster;
}
if (this.obj > 100 || this.obj == 0 || this.dark()) {
return this._toWhat();
}
this._read(wd1);
},
_read: function(wd1) {
if (this.dark()) {
this.println(" I see no " + wd1 + " here.");
return this._getCommand();
}
if (this.obj == this.magzin)
this.spk = 190;
if (this.obj == this.tablet)
this.spk = 196;
if (this.obj == this.messag)
this.spk = 191;
if (this.obj == this.oyster) {
if (this.toting(this.oyster)) {
if (this.hinted[1]) {
this.spk = 194;
} else {
return this.yes(192, 193, 54, function(yea) {
this.hinted[1] = yea;
return this._getCommand();
});
}
}
}
return this._commandError(this.spk);
},
_break: function() {
if (this.obj == this.mirror) {
this.spk = 148;
}
if (this.obj == this.vase && this.prop(this.vase) == 0) {
if (this.toting(this.vase)) {
this.drop(this.vase, this.loc);
}
this.setProp(this.vase, 2);
this.fixed[this.vase-1] = -1;
return this._commandError(198);
}
if (this.obj != this.mirror || !this.closed) {
return this._commandError(this.spk);
}
this.rspeak(197);
return this._disturbDwarves();
},
_wake: function() {
if (this.obj == this.dwarf && this.closed) {
this.rspeak(199);
return this._disturbDwarves();
}
return this._commandError(this.spk);
},
_suspend: function() {
var jstr;
var jobj = {};
var dt = new Date();
jobj.data = state_capture(this, state_data);
jobj.time = dt.toISOString();
jobj.trns = this.turns;
jobj.scor = this._score();
jstr = JSON.stringify(jobj);
if (this.save_write == null) {
this.speak("Game save method not defined.");
return this._getCommand();
}
if (this.save_write(this.save_key, jstr) == false) {
this.speak("Game save method failed.");
return this._getCommand();
}
this.speak("Game " + jobj.time + " saved.");
this.println('Say "restore", "resume", or "reload" to restore saved game.' );
return this._getCommand();
},
_resume: function () {
var jstr;
var jobj;
if (this.save_read == null) {
this.speak("Game restore method not defined.");
return this._getCommand();
}
if ((jstr = this.save_read(this.save_key)) == null) {
this.speak("Game restore method failed.");
return this._getCommand();
}
jobj = JSON.parse(jstr);
if (state_restore(this, jobj.data) == false) {
this.speak("Game restore data not valid.");
return this._getCommand();
}
this.speak("Game " + jobj.time + " restored.");
return this._nextTurn();
},
_hours: function() {
this.speak("COLOSSAL CAVE IS OPEN TO REGULAR ADVENTURERS AT THE FOLLOWING HOURS:");
this.println(" This Adventure runs in your Web browser, not PDP-10 mainframe. The\n cave is always open. Thanks for asking.");
return this._getCommand();
},
_hintActive: function(hint) {
switch (hint) {
case 3: 
if (this.prop(this.grate) == 0 && !this.here(this.keys)) {
return true;
} else {
this.hintlc[3] = 0;
return false;
}
case 4: 
return this.here(this.bird) && this.toting(this.rod) &&
this.obj == this.bird;
case 5: 
if (this.here(this.snake) && !this.here(this.bird)) {
return true;
} else {
this.hintlc[5] = 0;
return false;
}
case 6: 
if (this.atloc[this.loc-1] == 0 && this.atloc[this.oldloc-1] == 0
&& this.atloc[this.oldlc2-1] == 0 && this.holdng > 1) {
return true;
} else {
this.hintlc[6] = 0;
return false;
}
case 7: 
if (this.prop(this.emrald) != -1 && this.prop(this.pyram) == -1) {
return true;
} else {
this.hintlc[7] = 0;
return false;
}
case 8: 
return true;
default:
this.bug(27);
}
},
_caveClosing: function() {
this.setProp(this.grate, 0);
this.setProp(this.fissur, 0);
for (var i = 0; i < 6; i++) {
this.dseen[i] = false;
this.dloc[i] = 0;
}
this.move(this.troll, 0);
this.move(this.troll+100, 0);
this.move(this.troll2, Adventure.plac(this.troll));
this.move(this.troll2+100, Adventure.fixd(this.troll));
this.juggle(this.chasm);
if (this.prop(this.bear) != 3) {
this.destroy(this.bear);
}
this.setProp(this.chain, 0);
this.fixed[this.chain-1] = 0;
this.setProp(this.axe, 0);
this.fixed[this.axe-1] = 0;
this.rspeak(129);
this.clock1 = -1;
this.closng = true;
},
_setupStorageRoom: function() {
this.setProp(this.bottle, this.put(this.bottle, 115, 1));
this.setProp(this.plant, this.put(this.plant, 115, 0));
this.setProp(this.oyster, this.put(this.oyster, 115, 0));
this.setProp(this.lamp, this.put(this.lamp, 115, 0));
this.setProp(this.rod, this.put(this.rod, 115, 0));
this.setProp(this.dwarf, this.put(this.dwarf, 115, 0));
this.loc = 115;
this.oldloc = 115;
this.newloc = 115;
this.put(this.grate, 116, 0);
this.setProp(this.snake, this.put(this.snake, 116, 1));
this.setProp(this.bird, this.put(this.bird, 116, 1));
this.setProp(this.cage, this.put(this.cage, 116, 0));
this.setProp(this.rod2, this.put(this.rod2, 116, 0)); 
this.setProp(this.pillow, this.put(this.pillow, 116, 0));
this.setProp(this.mirror, this.put(this.mirror, 115, 0));
this.fixed[this.mirror-1] = 116;
for (var i = 1; i <= 100; i++) {
if (this.toting(i)) {
this.destroy(i);
}
}
this.rspeak(132);
this.closed = true;
return this._nextTurn();
},
_disturbDwarves: function() {
this.rspeak(136);
this._endGame();
},
db_score: function(lb, score, maxscore) {
},
_score: function(scoring) {
var score = 0;
var maxScore = 0;
for (var i = 50; i <= this.maxtrs; i++) {
if (Adventure.PTEXT[i-1] != null) {
var k = 12;
if (i == this.chest) {
k = 14;
}
if (i > this.chest) {
k = 16;
}
if (this.prop(i) >= 0) {
score = score+2;
}
if (this.place[i-1] == 3 && this.prop(i) == 0) {
score = score+k-2;
}
maxScore += k;
}
}
this.db_score(1, score, maxScore);
score += (this.maxdie - this.numdie) * 10;
maxScore += this.maxdie * 10;
this.db_score(2, score, maxScore);
if (!(scoring || this.gaveup)) {
score += 4;
}
maxScore += 4;
this.db_score(3, score, maxScore);
if (this.dflag != 0) {
score += 25;
}
maxScore += 25;
this.db_score(4, score, maxScore);
if (this.closng) {
score += 25;
}
maxScore += 25;
this.db_score(5, score, maxScore);
if (this.closed) {
switch (this.bonus) {
case 0:
score += 10;
break;
case 135:
score += 25;
break;
case 134:
score += 30;
break;
case 133:
score += 45;
break;
}
}
maxScore += 45;
this.db_score(6, score, maxScore);
if (this.place[this.magzin-1] == 108) { 
score++;
}
maxScore++;
this.db_score(6, score, maxScore);
score += 2;
maxScore += 2;
this.db_score(7, score, maxScore);
for (var i = 0; i < this.hinted.length; i++) {
if (this.hinted[i]) {
score -= Adventure.HINTS[i][1];
}
}
this.db_score(9, score, maxScore);
if (arguments.length == 0) {
return score;
}
if (scoring) {
this.println(' If you were to quit now, you would score ', score,
' out of a possible ', maxScore, '.');
} else {
this.println(' You scored ', score, ' out of a possible ', maxScore,
', using ', this.turns,' turns.');
}
return score;
},
_endGame: function() {
var score = this._score(false);
var rank;
for (rank = 0; rank < Adventure.RANKS.length; rank++) {
if (Adventure.RANKS[rank].score >= score)
break;
}
if (rank >= Adventure.RANKS.length) {
this.println(" You just went off my scale!!");
} else {
this.speak(Adventure.RANKS[rank].message);
if (rank + 1 < Adventure.RANKS.length) {
var k = Adventure.RANKS[rank].score+1-score;
this.println(" To achieve the next higher rating, you need ",
k, " more point", k == 1 ? "." : "s.");
} else {
this.println(' To achieve the next higher rating would be a neat trick!\n Congratulations!!');
}
}
this.terminate(null, null);
},
speak: function(msg) {
if (msg == null || msg == '>$<')
return;
if (this.blklin) {
this.println();
}
this.println(msg);
},
pspeak: function(msg, skip) {
this.speak(Adventure.PTEXT[msg-1][skip+1]);
},
rspeak: function(i) {
this.speak(Adventure.RTEXT[i-1]);
},
getin: function(callback) {
if (this.blklin) {
this.println();
}
this._callback = callback;
},
yes: function(prompt, ifYes, ifNo, callback) {
this.yesx(prompt, ifYes, ifNo, this.rspeak, callback);
},
yesx: function(prompt, ifYes, ifNo, spk, callback) {
if (prompt != null && prompt != 0)
spk.call(this, prompt);
if (typeof callback != 'function') {
throw Error("1180 Missing callback for yesx");
}
var self = this;
cb = function(m) {
m = m.toUpperCase();
if (m == "YES" || m == "Y") {
if (ifYes != null && ifYes != 0)
spk.call(self, ifYes);
callback.call(self, true);
} else if (m == "NO" || m == "N") {
if (ifNo != null && ifNo != 0) {
spk.call(self, ifNo);
}
callback.call(self, false);
} else { 
self.println(" Please answer the question.");
self.getin(cb);
}
};
this.getin(cb);
},
vocab: function(word, init) {
word = word.toUpperCase();
if (word.length > 5)
word = word.substr(0, 5);
if (init < 0) {
for (var i = 0; i < Adventure.VOCAB.length; i++) {
var m = Adventure.VOCAB[i][word];
if (m)
return m;
}
return -1;
} else {
if (init >= Adventure.VOCAB.length) {
throw Error("1190 Bad init value " + init);
}
var m = Adventure.VOCAB[init][word];
if (!m)
throw Error("1190 Missing required word " + word + " (I think)");
return m ? (m%1000) : -1;
}
},
destroy: function(object) {
this.move(object, 0);
},
juggle: function(object) {
var i = this.place[object-1];
var j = this.fixed[object-1];
this.move(object, i);
this.move(object+100, j);
},
move: function(object, where) {
var from;
if (object > 100) {
from = this.fixed[object-101];
} else {
from = this.place[object-1];
}
if (from > 0 && from <= 300) {
this.carry(object, from);
}
this.drop(object, where);
},
put: function(object, where, pval) {
this.move(object, where);
return (-1) - pval;
},
carry: function(object, where) {
if (object <= 100) {
if (this.place[object-1] == -1) {
return;
}
this.place[object-1] = -1;
this.holdng++;
}
if (this.atloc[where-1] == object) {
this.atloc[where-1] = this.link[object-1];
return;
}
temp = this.atloc[where-1];
while (this.link[temp-1] != object) {
temp = this.link[temp-1];
}
this.link[temp-1] = this.link[object-1];
return;
},
drop: function(object, where) {
if (object <= 100) {
if (this.place[object - 1] == -1) {
this.holdng--;
}
this.place[object-1] = where;
} else {
this.fixed[object-101] = where;
}
if (where > 0) {
this.link[object-1] = this.atloc[where-1];
this.atloc[where-1] = object;
}
},
ran: function(range) {
return Math.floor(Math.random()*range);
},
_dbBugMessages: [
'MESSAGE LINE > 70 CHARACTERS',
'NULL LINE IN MESSAGE',
'TOO MANY WORDS OF MESSAGES',
'TOO MANY TRAVEL OPTIONS',
'TOO MANY VOCABULARY WORDS',
'REQUIRED VOCABULARY WORD NOT FOUND',
'TOO MANY RTEXT OR MTEXT MESSAGES',
'TOO MANY HINTS',
'LOCATION HAS COND BIT BEING SET TWICE',
'INVALID SECTION NUMBER IN DATABASE'
],
_rtBugMessages: [
'SPECIAL TRAVEL (500>L>300) EXCEEDS GOTO LIST',
'RAN OFF END OF VOCABULARY TABLE',
'VOCABULARY TYPE (N/1000) NOT BETWEEN 0 AND 3',
'INTRANSITIVE ACTION VERB EXCEEDS GOTO LIST',
'TRANSITIVE ACTION VERB EXCEEDS GOTO LIST',
'CONDITIONAL TRAVEL ENTRY WITH NO ALTERNATIVE',
'LOCATION HAS NO TRAVEL ENTRIES',
'HINT NUMBER EXCEEDS GOTO LIST',
'INVALID MONTH RETURNED BY DATE FUNCTION'
],
bug: function(num) {
var m;
if (num >= 0 && num < this._dbBugMessages.length) {
m = this._dbBugMessages[num];
} else if (num >= 20 && num < (this._rtBugMessages.length+20)) {
m = this._rtBugMessages[num-20];
} else {
m = "Invalid error number " + num;
}
throw Error('1200 Fatal error: ' + m);
}
};
