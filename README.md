# web-retrieval-augmented-generation-front

## 開発準備

### コンテナ起動前

初回のみ
docker network create web-retrieval-augmented-generation-network

### コンテナ起動後

初回と package.json 変更時
npm i

## debug

npm run dev

## deploy

npm run build

## todo

チャットルームメッセージ入力中に別チャットルームなどに移動しても local storage (pinia) で保持しておきたい

チャットルームやチャットルームメッセージには infinite scrollers を利用したい

api は response body のオブジェクトと完全に一致させる
