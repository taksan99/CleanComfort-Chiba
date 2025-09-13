#!/bin/bash
# Sharp ライブラリのインストールを確認
echo "Installing Sharp..."
npm install --arch=x64 --platform=linux sharp

# その他の必要なビルド手順
echo "Running Next.js build..."
next build
