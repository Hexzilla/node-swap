cd ./frontend
npm run build
cp -rf ./dist/* ../public/
cp -rf ./dist/* /var/www/html/
cd ..
