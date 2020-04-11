# express-class-server

## 実行時の変数

以下の内容を環境変数として定義した上で実行してください。
なお、以下に書かれている値はデフォルト値です。

```.json
{
	"CLUSTER_MODE": "true", // 起動がクラスタモードかシングルモードか
	"CLUSTER_NUM": "CPU数", // クラスタ数
	"PORT": "3000" // サーバポート
}
```

## デバッグ

以下は `VS Code` でデバッガを起動する場合の設定内容です。
`configurations` の中に入れて使用してください。

```launch.json
{
	"type": "node",
	"request": "launch",
	"name": "Launch Program",
	"program": "${workspaceFolder}/example/index.js",
	"autoAttachChildProcesses": true,
	"console": "internalConsole"
}
```
