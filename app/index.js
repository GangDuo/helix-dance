const fs = require("fs");

var sources = init([
    {name: "太田",   reserve: 2, hold: 2,  want: 6,  week: 36},
    {name: "熊谷",   reserve: 2, hold: 1,  want: 7,  week: 35},
    {name: "鶴ヶ島", reserve: 2, hold: 2,  want: 5,  week: 35},
    {name: "岡崎",   reserve: 2, hold: 6,  want: 0,  week: 36},
    {name: "浜松",   reserve: 2, hold: 12, want: -2, week: 36},
    {name: "ｽﾏｰｸ",   reserve: 2, hold: 2,  want: 7,  week: 35},
    {name: "本社",   reserve: 0, hold: 7,  want: 0,  week: 99},
]);

var isBt600 = false;
//console.log(sources);
// 週番号
var xs = sources.map(x => x.week)
.reduce((ax, x) => {ax[x] = x;return ax;}, [])
.filter(x => x > 0)
.sort();
//console.log(xs);

function init(sources) {
  // 最低保持台数をマイナスする。
  return sources.map(x => {
    // 余っている数
    let movable = x.hold - x.reserve
    return {
      name: x.name,
      reserve: x.reserve,
      hold: movable,
      want: (movable<0) ? (x.want - movable) : x.want,
      week: x.week,
      in: {},
      out: {},
    }
  })
}

const firstWeek = xs[0];
var hots = sources.filter(x => x.week === firstWeek);
var colds = sources.filter(x => x.week !== firstWeek).sort((a,b) => b.week - a.week);
var g;
for(let i = 0; i < xs.length; i++) {
  g = forward(hots, colds);

  colds = [...g.hots, ...g.colds.filter(x => x.week !== xs[i+1])];
  hots = g.colds.filter(x => x.week === xs[i+1]);
}

try {
  // 拠点間移動履歴
  fs.writeFileSync("history.txt", JSON.stringify(g.colds, null, "\t"));
} catch(e) {
  console.log(e.message);
}

function forward(hots_, colds_) {
  // クローン生成
  let hots = JSON.parse(JSON.stringify(hots_));
  let colds = JSON.parse(JSON.stringify(colds_));

  for(let i = 0; i < hots.length; i++) {
    if(hots[i].name === "本社") continue;
    if(hots[i].want <= 0) continue;

    let flag = false;
    for(let j = 0; j < colds.length; j++) {
      if(colds[j].hold >= hots[i].want)  {
        flag = true;
        break;
      }
    }

    if(flag) {
      // 1店舗でほしい台数を賄える
      for(let j = 0; j < colds.length; j++) {
        if(colds[j].hold >= hots[i].want)  {
          let qty = hots[i].want

          hots[i].in[hots[i].week] = hots[i].in[hots[i].week] || [];
          hots[i].in[hots[i].week].push({
            store: colds[j].name,
            qty,
          });
          colds[j].out[hots[i].week] = colds[j].out[hots[i].week] || [];
          colds[j].out[hots[i].week].push({
            store: hots[i].name,
            qty,
          });

          colds[j].hold -= qty;
          colds[j].want += qty;
          hots[i].hold += qty;
          hots[i].want -= qty;
          break;
        }
      }
    } else {
      // 1店舗では足りない場合
      for(let j = 0; j < colds.length; j++) {
        let ex = 0;
        let qty = colds[j].hold;
        
        if(hots[i].want <= 0) break;

        console.assert(qty > 0, `${hots[i].name} <- ${colds[j].name} の在庫がありません！`);
        // BT600は奇数の移動を許可しない
        if(isBt600 && qty === 1) {
          continue;
        }
        if(qty <= 0) continue;

        if(hots[i].want < colds[j].hold) {
          qty = hots[i].want;
          ex = colds[j].hold - hots[i].want
        }
        
        hots[i].in[hots[i].week] = hots[i].in[hots[i].week] || []
        hots[i].in[hots[i].week] = [...hots[i].in[hots[i].week], ...[{
          store: colds[j].name,
          qty,
        }]]

        colds[j].out[hots[i].week] = colds[j].out[hots[i].week] || []
        colds[j].out[hots[i].week] = [...colds[j].out[hots[i].week], ...[{
          store: hots[i].name,
          qty,
        }]]

        hots[i].want -= qty;
        hots[i].hold += qty;
        colds[j].want += qty;
        colds[j].hold = ex;

        console.log(`在庫移動: ${hots[i].name} <- ${colds[j].name} ${qty} あと${hots[i].want}個`);
      }
    }  
  }
  return {hots, colds};
}
