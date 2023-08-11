# Deploy

main ブランチ : https://yomogytest.netlify.app/
staging ブランチ : https://yomogytest-staging.netlify.app/

安定運用が確認できたら、  
https://yomogy.com に移行します。

# ブランチ

main : 本番環境
staging : 本番前のテスト環境 (確認後そのまま main にマージするのが望ましい)
dev ; 開発環境のメイン
dev 以下は、プロジェクトごとにブランチを各自で作成

ブランチの状況確認
https://github.com/yomogyhub/yomogy_test/network

権限
main は、staging からのマージしか受け付けない。

main と staging が受け取る Pull request は、運営メンバーのみが承認できる。

GitHub Actions を利用して、プルリクエストに対するテストやその他の CI/CD タスクを実行し、それらのタスクがすべて成功するまでマージを許可しないように設定できます。以下の手順で設定を行います：

GitHub Actions の設定: まず、リポジトリ内の.github/workflows ディレクトリに CI の YAML ファイルを設置します。このファイルで、何らかのテストやビルドタスクを定義します。
