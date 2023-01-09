import './style.css'
import { getWeather } from './weather'
import {Icon_Map} from './icon'

getWeather(30.6,114.3,Intl.DateTimeFormat().resolvedOptions().timeZone)
.then(renderWeather)
.catch(e=>alert(e))

function renderWeather (res){
  const {current,daily,hourly}=res
  console.log(res)
  document.body.classList.remove('blurred')
  renderCurrent(current);
  renderDaily(daily);
  renderHourly(hourly);
}

function setValue(content,value,{parent=document}={}){
  parent.querySelector(`[data-${content}]`).textContent=value
}
function getUrl(code){
  return `public/icons/${Icon_Map.get(code)}.svg`
  
}
function renderCurrent(current){
  const icon = document.querySelector('[data-current-icon]');
  icon.src=getUrl(current.code)
  setValue('current-temp',current.temp);
  setValue('current-high',current.high);
  setValue('current-low',current.low);
  setValue('current-fl-high',current.fl_high);
  setValue('current-fl-low',current.fl_low);
  setValue('current-precip',current.precip);
  setValue('current-wind',current.wind);
}
function renderDaily(daily){
  const dailySection = document.querySelector('[data-day-section]')
  const daycardTemplate = document.querySelector('#day-card-template')
  dailySection.innerHTML = ''
  const DAY_FORMATTER = new Intl.DateTimeFormat('en-US',{weekday:'short'})
  daily.forEach(element => {
    const daycard = daycardTemplate.content.cloneNode(true)
    setValue('temp',element.temp,{parent:daycard})
    setValue('date',DAY_FORMATTER.format(element.time),{parent:daycard})
    const icon = daycard.querySelector('[data-icon]')
    icon.src=getUrl(element.code)
    dailySection.append(daycard)
  });
  

}
function renderHourly(hourly){
  const hourlySection= document.querySelector('[data-hour-section]')
  const hourlyTemplate= document.querySelector('#hour-row-template')
  hourlySection.innerHTML=''
  const DAY_FORMATTER = new Intl.DateTimeFormat('en-US',{weekday:'short'})
  const HOUR_FORMATTER = new Intl.DateTimeFormat('en-US',{hour:'numeric'})
  hourly.forEach(element=>{
    const hourlyrow = hourlyTemplate.content.cloneNode(true)
    setValue('day',DAY_FORMATTER.format(element.time),{parent:hourlyrow})
    setValue('time',HOUR_FORMATTER.format(element.time),{parent:hourlyrow})
    setValue('temp',element.temp,{parent:hourlyrow})
    setValue('fl-temp',element.fl,{parent:hourlyrow})
    setValue('wind',element.wind,{parent:hourlyrow})
    setValue('precip',element.precip,{parent:hourlyrow})
    const icon = hourlyrow.querySelector('[data-icon]')
    icon.src=getUrl(element.code)
    hourlySection.append(hourlyrow)
  })

}