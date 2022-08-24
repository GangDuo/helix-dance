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

