# 福岡県 新型コロナウイルス感染症ポータルサイト

[![福岡県 新型コロナウイルス感染症ポータルサイト](https://github.com/Code-for-Fukuoka/covid19/blob/development/static/ogp.png?raw=true)](https://fukuoka.stopcovid19.jp/)

## 貢献の仕方
Issues にあるいろいろな修正にご協力いただけると嬉しいです。

詳しくは[貢献の仕方](./.github/CONTRIBUTING.md)を御覧ください。

## 行動原則
詳しくは[サイト構築にあたっての行動原則](./.github/CODE_OF_CONDUCT.md)を御覧ください。

## ライセンス
本ソフトウェアは、[MITライセンス](./LICENSE.txt)の元提供されています。

## 開発者向け情報

### 環境構築の手順

- 必要となるNode.jsのバージョン: 10.19.0以上

**yarn を使う場合**
``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```
Linuxにおいて、yarn installで` [KERROR: [Errno 2] No such file or directory: 'install'`と言われてしまう場合のヒントは[こちら](https://www.suzu6.net/posts/128-ubuntu-yarn-error/)。

**docker compose を使う場合**
```bash
# serve with hot reload at localhost:3000
$ docker-compose up --build
```

### ステージング・本番環境への反映

`master` ブランチがアップデートされると、自動的に `production` ブランチにHTML類がbuildされます。そして、開発用サイト https://fukuoka.stopcovid19.jp/ が更新されます。

`development` ブランチがアップデートされると、自動的に `dev-pages` ブランチにHTML類がbuildされます。そして、開発用サイト https://dev-covid19-fukuokapref.netlify.com/ が更新されます。
