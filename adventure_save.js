state_data = {
gstype: null,
gstime: null,
_itemProps: null,
abb: null,
abbnum: null,
atloc: null,
bonus: null,
clock1: null,
clock2: null,
closed: null,
closng: null,
detail: null,
dflag: null,
dkill: null,
dloc: null,
dseen: null,
fixed: null,
foobar: null,
gaveup: null,
hinted: null,
hintlc: null,
holdng: null,
iwest: null,
knfloc: null,
limit: null,
link: null,
lmwarn: null,
loc: null,
numdie: null,
obj: null,
odloc: null,
oldloc: null,
panic: null,
place: null,
tally: null,
tally2: null,
tk: null,
turns: null,
wizard: null,
wzdark: null
};
function state_capture (game, state) {
var jstr;
var d = new Date();
game.gstime = d.getTime();
for (var v in state) {
state[v] = JSON.stringify(game[v]);
}
jstr = JSON.stringify(state);
for (var v in state) {
state[v] = null;
}
return jstr;
};
function state_restore (game, jstr) {
var state = JSON.parse(jstr);
if (state.gstype != game.gstype) {
return false;
}
for (var v in state) {
game[v] = JSON.parse(state[v]);
}
game.newloc = game.loc;
return true;
}
