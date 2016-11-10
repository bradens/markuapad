#! /bin/bash

./node_modules/.bin/webpack --config webpack.config.js

cp build/dist.css app/assets/stylesheets/markuapad.css
cp build/dist.js app/assets/javascripts/markuapad.js


