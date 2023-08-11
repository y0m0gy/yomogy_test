# ブランチ

'main' : 本番環境
'staging' : 本番前のテスト環境 (確認後そのまま main にマージするのが望ましい)
'dev' ; 開発環境のメイン
dev 以下は、プロジェクトごとにブランチを各自で作成

ブランチの状況確認
https://github.com/yomogyhub/yomogy_test/network

権限
main は、staging からのマージしか受け付けない。

main と staging が受け取る Pull request は、運営メンバーのみが承認できる。
