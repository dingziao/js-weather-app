import axios from "axios";
//https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime
export function getWeather(lat,lon,timezone){
    return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",{
        params:{
            latitude:lat,
            longitude:lon,
            timezone,
        }
    }).then(({data})=>{
        let {current_weather:current_list,daily:daily_list,hourly:hourly_list}=data;
        const current = parseCurrent(current_list,daily_list);
        const daily = parseDaily(daily_list);
        const hourly = parseHourly(hourly_list,current);
        return {data,current,daily,hourly}
    })
}
function parseCurrent(current_list,daily_list){
    const {temperature:temp} = current_list;
    const {time}=current_list;
    const {weathercode:code}=current_list;
    const {windspeed:wind}=current_list;
    const {apparent_temperature_max:[high]}=daily_list;
    const {apparent_temperature_min:[low]}=daily_list;
    const {temperature_2m_max:[fl_high]}=daily_list;
    const {temperature_2m_min:[fl_low]}=daily_list;
    const {precipitation_sum:[precip]}=daily_list;
    return {temp:temp,
        time:time*1000,
        code:code,
        high:high,
        wind:wind,
        low:low,
        fl_high:fl_high,
        fl_low:fl_low,
        precip:precip}
}
function parseDaily(daily_list){
    return daily_list.weathercode.map(function(item,index){
        return {time:daily_list.time[index]*1000,
        code:daily_list.weathercode[index],
        temp:daily_list.apparent_temperature_max[index]} 
    })
}
function parseHourly(hourly_list,current){
    return hourly_list.weathercode.map(function(item,index){
        return{
            time:hourly_list.time[index]*1000,
            code:hourly_list.weathercode[index],
            temp:hourly_list.temperature_2m[index],
            fl:hourly_list.apparent_temperature[index],
            wind:hourly_list.windspeed_10m[index],
            precip:hourly_list.precipitation[index]
        }
    }).filter(item=>item.time>current.time)

}