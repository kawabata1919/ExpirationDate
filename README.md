###消費期限管理アプリ（Windows環境で動作）

消費期限管理をWebアプリ内で行う
ユーザーが行う行動は2パターン

1 カメラでバーコードを撮影して、消費期限を取得

2 手入力で消費期限を入力

入力された情報はDBで管理　DBにはFastapiを使用

##HTTPS通信の有効化について
PCのみであればHTTP通信のみで検証可能であったが、使用環境としてスマートフォンを想定しており、HTTPS通信が必要であるため、認証鍵を用意する必要がある。
Windows環境での構築ステップは以下の通り(Mac, Linuxでは別の操作が必要の可能性大)
#参考URL
https://qiita.com/dai-andy1976/items/b179ef6e56087ad1943d
https://qiita.com/dai-andy1976/items/6a47bb36932aa1d5af2d
https://chocolatey.org/install#individual
https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5
https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10262656235

1. PowerShellを管理者権限で開く
2. Chocolateryをインストールする。
   コマンドは以下の通り
   ```
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```
   > PowerShellの実行ポリシーがRestrictedになっている場合、上記のインストールコマンドが使用できない可能性があるため、\
   > その場合は以下を実行。\
   `Get-ExecutionPolicy #Restrictedであることを確認`\
   `Set-ExecutionPolicy AllSigned`

4. chocoコマンドが実行できることを確認
   > choco list -l
   Chocolatey v2.5.0
5. https通信に必要なパッケージ mkcertをインストールする
   > choco install mkcert
   > mkcert --install
   ルート証明書: rootCA.pemが発行される（rootCA.pemの保存先はmkcert -CAROOTで確認できる）
6. フロントサーバーで使用されているURLを確認
   Vite+Reactの開発サーバーを起動し、ログに記録されているLocal:　〇〇　Network:　〇〇のアドレスを確認
7. URLに対してサーバー証明書を発行
   > mkcert localhost
   > #2つのURLに対して証明書を発行する際は
   > mkcert localhost 192.168.〇.〇
   > #2つのURLを指定した場合、デフォルトでlocalhost+1-key.pem（秘密鍵） および localhost+1.pem(サーバー証明書)が発行される
8. スマートフォンで確認する場合はルート証明書をスマートフォン内に格納する
   iPhoneの場合、設定> 一般> 情報> 証明書信頼設定で転送した証明書をオンにする

以上の設定を行い、Webアプリ内でパスを通すことでhttps通信を行うことができる。
