# /bin/bash
rm -rf /node-modules /dist

echo "==== npm install started ===="

npm install

echo "==== npm install completed ===="

npm run build