# node-jim

Node.js + Express + MongoDB + libkkc による日本語入力を支援する Web API と、
その API を利用した日本語入力のデモアプリのセット.

## Requirements

* [Node.js](http://nodejs.org)
* [MongoDB](http://www.mongodb.org)
* [libkkc](https://bitbucket.org/libkkc/libkkc/)
* [Python](http://www.python.org)
* [PyGObject](https://live.gnome.org/PyGObject)

なお、libkkc について、node-jim から利用するだけならば、
ibus-kkc はインストールしなくても動きます.

## Installation

    $ git clone https://github.com/hankei6km/node-jim.git
    $ wget http://hankei6km.bitbucket.org/webOS/data/predictive-dict/predictive-dict-from-naist-dict.zip
    $ unzip predictive-dict-from-naist-dict.zip predictive-dict.json
    $ cd node-jim/
    $ npm install
    $ bin/node-jim-import-predictive ../predictive-dict.json

## Quick Start

### API サーバーの開始

    $ node app.js

### 日本語入力のデモ

ブラウザで `http://localhost:3000` を開き、テキストエリアに入力.
`Ctrl-J` で入力機能の ON / OFF.

なお、テキストエリアに `ime-mode` は設定してありますが、
環境によっては**通常の IME は自動的には無効化されない**ので注意してください.

## Conversion API

[Yahoo! Japan デベロッパーネットワークのかな漢字変換API](http://developer.yahoo.co.jp/webapi/jlp/jim/v1/conversion.html)を
意識した作りになっています。
実際は使える引数もレスポンスのフォーマットも違いますが、
似たような感じで呼び出せるのでないかと思います。

以下、リクエストが `mode=normal` `sentence=へんかんのてすと` のときの
サンプルレスポンス(JSON)です.

    {
      "segments":[{
        "text":"へんかん",
        "candidates":["変換","返還"]
      },{
        "text":"の",
        "candidates":["の","野","ノ"]
      },{
        "text":"てすと",
        "candidates":["テスト"]
      }]
    } 

なお、`mode=decode` のときはレスポンスの内容が他のモードのときと若干異なります
(基本的には libkkc から受け取った結果をほぼそのまま JSON にしているだけ).

## License

Copyright (c) 2013 hankei6km (MIT License)

詳細および、
このリポジトリに同梱させていただいているプロダクトについては、
LICENSE ファイルを参照.  
`npm install` によりインストールされるモジュールについては、
各モジュールの README 等を参照.
