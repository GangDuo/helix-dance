# Docker で Node.js 開発環境を用意する

## はじめに
docker、docker-composeをインストールします。  
docker-compose.ymlを開き、下記項目を埋める。

```node:docker-compose.yml
image: node:使用するNode.jsのバージョンを記載する
container_name: 任意のコンテナ名
```

## 開発環境構築
### Node.js バージョン確認

```bash:
docker-compose run --rm app node -v
```

### Node.js プロジェクト作成

```bash:
docker-compose run --rm app npm init
```

### ライブラリをインストールする

```bash:
docker-compose run --rm app npm install <パッケージ名> --save
```

### package.json の依存ライブラリをインストールする

```bash:
docker-compose run --rm app npm install
```

### package.json で定義したスクリプトを実行する

```node:package.json
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
```

docker-compose.yml の ports で指定したポートを通すには --service-ports オプションを付けます。

```bash:
docker-compose run --rm --service-ports app npm run dev
```

## 使用方法

1. ```./app/index.js```を開き、データソースを更新する。

```node:
{
  name: "拠点名",
  reserve: 必ず保持しなければならない備品の最小数量,
  hold: 保有している備品の総数,
  want: 追加で必要な備品の数量,
  week: 備品を使用する週番号
}
```

2. 拠点間の備品移動数を計算し、history.jsonを出力する。

```sh:
docker compose run --rm --service-ports app npm start
```

3. history.jsonから報告書を生成し、out.mdを出力する。

```sh:
docker compose run --rm --service-ports app node report.js
```