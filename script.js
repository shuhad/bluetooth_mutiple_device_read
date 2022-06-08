import * as my_dongle from 'bleuio'
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
  document.getElementById("connect").classList.add('disabled');
})
let dev1BoardID='45840D'
let dev2BoardID='60FDED'
document.getElementById('getData').addEventListener('click', function(){
    
    //show loading
    document.getElementById("loading").style.display = "block";
    //make the dongle in dual role , so it can scan for peripheral devices advertised data
    my_dongle.at_dual().then(()=>{
        //scan for a devices advertised data, a PM sensor
        my_dongle.at_findscandata(dev1BoardID,8).then((x)=>{
            //it returns an array of advertised data
            //from the array, we take the last one
            //it looks like this "[F9:0D:35:E7:72:65] Device Data [ADV]: 0201061BFF5B07050345840DB1031527FB002A010402040004000400000001"
            //then we split it by space
            //so we can get the advertised data only (the last part)
            return x[x.length-1].split(" ").pop()
        }).then((adv1)=>{ 
            //now lets decode the advertised data for this device using the device documentaion
            let pmEnvData=advDataDecode(adv1)
            //we do the same process to get advertised data of another device
            //after waiting 1 seconds
            setTimeout(()=>{
                my_dongle.at_findscandata(dev2BoardID,8).then((y)=>{
                    let adv2= y[y.length-1].split(" ").pop()
                    //again we decode the advertised data for this device using the device documentaion
                    let co2EnvData=advDataDecode(adv2)
                    //now merge pm data to this array
                    co2EnvData.pm1=pmEnvData.pm1
                    co2EnvData.pm25=pmEnvData.pm25
                    co2EnvData.pm10=pmEnvData.pm10
                    document.getElementById('airData').innerHTML=`
                    Air Quality data from PM and CO2 sensor devices<br/><br/>
                    CO2 : ${co2EnvData.co2} ppm<br/>
                    PM 1.0 : ${co2EnvData.pm1} µg/m³<br/>
                    PM 2.5 : ${co2EnvData.pm25} µg/m³<br/>
                    PM 10 : ${co2EnvData.pm10} µg/m³<br/>
                    Temperature : ${co2EnvData.temp} °C<br/>
                    Humidity : ${co2EnvData.hum} %rH<br/>
                    Pressure : ${co2EnvData.pressure} mbar<br/>
                    Light : ${co2EnvData.light} Lux<br/>

                    `
                    //hide loading
                    document.getElementById("loading").style.display = "none"; 
                })
            },1000)
            
        })
    })
    

  })

  const advDataDecode =((data)=>{
    let pos = data.indexOf("5B0705")
    let dt = new Date();
    let currentTs = dt.getFullYear() 
    + '/' 
    + (dt.getMonth() + 1).toString().padStart(2, "0") 
    + '/' 
    + dt.getDate().toString().padStart(2, "0")
    +' '
    +
    dt.getHours().toString().padStart(2, "0")
    +
    ':'
    +
    dt.getMinutes().toString().padStart(2, "0")
    +
    ':'
    +dt.getSeconds().toString().padStart(2, "0")
    let tempHex=parseInt('0x'+data.substr(pos+22,4).match(/../g).reverse().join(''))
    if(tempHex>1000)
        tempHex = (tempHex - (65535 + 1) )/10
    else
        tempHex = tempHex/10
    return {
      "boardID":data.substr(pos+8,6),
      "type":data.substr(pos+6,2),
      "light":parseInt('0x'+data.substr(pos+14,4).match(/../g).reverse().join('')),
      "pressure":parseInt('0x'+data.substr(pos+18,4).match(/../g).reverse().join(''))/10,
      "temp":tempHex,
      "hum":parseInt('0x'+data.substr(pos+26,4).match(/../g).reverse().join(''))/10,
      "pm1":parseInt('0x'+data.substr(pos+34,4).match(/../g).reverse().join(''))/10,
      "pm25":parseInt('0x'+data.substr(pos+38,4).match(/../g).reverse().join(''))/10,
      "pm10":parseInt('0x'+data.substr(pos+42,4).match(/../g).reverse().join(''))/10,
      "co2":parseInt('0x'+data.substr(pos+46,4)),
      "ts":currentTs
    }
})