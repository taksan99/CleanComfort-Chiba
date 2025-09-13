#!/bin/bash
# Sharp ライブラリのインストールを確認
if [ -f "node_modules/sharp/vendor/libvips.so" ]; then
  echo "Sharp already installed, skipping..."
else
  echo "Installing Sharp..."
  npm install --arch=x64 --platform=linux sharp
fi

# その他の必要なビルド手順
echo "Running Next.js build..."
next build
