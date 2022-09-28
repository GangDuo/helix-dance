const fs = require('fs');
let json = JSON.parse(fs.readFileSync("history.json"));

var xs = {
    32: "7月31日（日）",
    33: "8月7日（日）",
    34: "8月14日（日）",
    35: "8月21日（日）",
    36: "8月27日（土）",
}

var content = [
    `|自店|&lt;in|&gt;out|`,
    `|---|---|---|`
]
json.forEach(x => {
    var s2 = Object.keys(x.in).map(key => x.in[key].map(y => `${y.store}: ${y.qty}`).join("<br>"))
    var s3 = Object.keys(x.out).map(key => xs[key] + "必着<br>" + x.out[key].map(y => `${y.store}: ${y.qty}`).join("<br>")).join("<br>")
    content.push(`|${x.name}|${s2}|${s3}|`);
})
