# node-jim

Node.js + Express + MongoDB による日本語入力っぽいなにか.
出来ることは単純な文字列マッチングによる推測変換のようなもの.

## Requirements

* [Node.js](http://nodejs.org)
* [MongoDB](http://www.mongodb.org)

## Installation

    $ git clone https://github.com/hankei6km/node-jim.git
    $ wget http://hankei6km.bitbucket.org/webOS/data/predictive-dict/predictive-dict-from-naist-dict.zip
    $ unzip predictive-dict-from-naist-dict.zip predictive-dict.json
    $ cd node-jim/
    $ npm install
    $ bin/node-jim-import-predictive ../predictive-dict.json

## Quick Start

### サーバーの開始

    $ node app.js

### 入力

ブラウザで `http://localhost:3000` を開き、テキストエリアに入力.
`Ctrl-J` で入力機能の ON / OFF.

なお、テキストエリアに `ime-mode` は設定してありますが、
環境によっては**通常の IME は自動的には無効化されない**ので注意してください.

## License

Copyright (c) 2013 hankei6km (MIT License)

詳細および、
このリポジトリに同梱させていただいているプロダクトについては、
LICENSE ファイルを参照.  
`npm install` によりインストールされるモジュールについては、
各モジュールの README 等を参照.
