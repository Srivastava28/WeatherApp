const http = require("http");
const fs= require("fs");
var requests = require("requests");

const homefile =  fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempval%}', (Math.round((orgVal.main.temp-273.15)*100)/100).toFixed(2));
    temperature = temperature.replace('{%tempmin%}', (Math.round((orgVal.main.temp_min-273.15)*100)/100).toFixed(2));
    temperature = temperature.replace('{%tempmax%}', (Math.round((orgVal.main.temp_max-273.15)*100)/100).toFixed(2));
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);

    return temperature;
};

const server= http.createServer((req,res)=>{

    if(req.url=='/')
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Jaunpur&appid=6e44c22d300dc6d25fcf31e42e4e5387')
        .on('data', function (chunk) {
            const objdata= JSON.parse(chunk);
            const arrData = [objdata];
        //   console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val)=>replaceVal(homefile, val ))
            .join("");
            
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on('end', function (err) {
          if (err) return console.log('connection closed due to errors', err);
         
          res.end();
        });  
    }

});
server.listen(8000,"127.0.0.1");
