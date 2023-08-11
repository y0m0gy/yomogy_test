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

GitHub Actions を利用して、プルリクエストに対するテストやその他の CI/CD タスクを実行し、それらのタスクがすべて成功するまでマージを許可しないように設定できます。以下の手順で設定を行います：

GitHub Actions の設定: まず、リポジトリ内の.github/workflows ディレクトリに CI の YAML ファイルを設置します。このファイルで、何らかのテストやビルドタスクを定義します。

ブランチ保護ルールの設定:

リポジトリの設定ページに移動します。
「Branches」タブを選択し、「Branch protection rules」セクションを見つけます。
「Add rule」をクリックして新しいルールを作成します。
保護したいブランチの名前やパターンを入力します（例：main や master）。
「Require status checks to pass before merging」オプションを選択します。
作成した GitHub Actions のワークフロー名をチェックボックスから選択します。これにより、そのワークフローが成功しない限り、プルリクエストはマージできなくなります。
必要に応じて他の設定も行い、最後に「Create」または「Save changes」をクリックします。
これで、GitHub Actions のチェックが成功しない限り、該当のブランチへのプルリクエストはマージできなくなります。これにより、品質の確保やバグの予防に役立ちます。
