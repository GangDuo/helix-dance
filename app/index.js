var sources = init([
    {name: "太田",   reserve: 2, hold: 2,  want: 6,  week: 36},
    {name: "熊谷",   reserve: 2, hold: 1,  want: 7,  week: 35},
    {name: "鶴ヶ島", reserve: 2, hold: 2,  want: 5,  week: 35},
    {name: "岡崎",   reserve: 2, hold: 6,  want: 0,  week: 36},
    {name: "浜松",   reserve: 2, hold: 12, want: -2, week: 36},
    {name: "ｽﾏｰｸ",   reserve: 2, hold: 2,  want: 7,  week: 35},
    {name: "本社",   reserve: 0, hold: 7,  want: 0,  week: 99},
]);

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
