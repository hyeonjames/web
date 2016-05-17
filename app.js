'use strict'
let fs = require('fs');
let express = require('express');
let setting = JSON.parse(fs.readFileSync('./mapping.json'));
let app = express();

let routerInfo = [];
let routerMapping = {};
for(var url in setting){
    let func = require(setting[url]);
    let obj = null;
    for(var i=0;i<routerInfo;i++){
        if(routerInfo[i].func == func){
            obj = routerInfo[i];
            break;
        }
    } 
    if(obj == null){
        var route = express.Router();
        func(route,express);
        obj = {
            func : func,
            router : route
        }
        routerInfo.push(routerInfo);
    }
    routerMapping[url] = obj.router;
}

app.set('view engine','ejs');
app.use(function(req,res,...args){
    let host = req.get('host');
    let route = routerMapping[host] || routerMapping['default'];
    
    if(route){
        route(req,res,...args);
    }
    else {
        res.send(404);
    }
});

app.listen(80);