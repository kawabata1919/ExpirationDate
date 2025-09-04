import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // または '0.0.0.0'
    https: {
      // PCおよびスマートフォンで動作確認するために、https通信を有効化
      // 自身で作成した認証鍵ファイルに合わせて、keyおよびcertを変更すること
      // 参考にしたURL　
      // https://qiita.com/dai-andy1976/items/b179ef6e56087ad1943d
      // https://qiita.com/dai-andy1976/items/6a47bb36932aa1d5af2d
      // https://chocolatey.org/install#individual
      // https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5
      // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10262656235
      key: fs.readFileSync('./localhost+1-key.pem'),
      cert: fs.readFileSync('./localhost+1.pem'),
    }
  },
})
