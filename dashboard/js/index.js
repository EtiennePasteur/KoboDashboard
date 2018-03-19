// DASHBOARD CONFIGURATION 
var WEATHER_UNDERGROUND_API_KEY = "SUPER_SECRET";
var AIRVISUAL_API_KEY = "SUPER_SECRET";
var LATITUDE = "XX.XXXXXXX";
var LONGITUDE = "XXX.XXXXXXX";
var CALENDAR_URL = "SUPER_CALENDAR_URL";
var COUNTDOWN_DATE = new Date("2018/06/10 00:00:00");
var HOURS_INTERVAL_DAILY_FORCAST = 3;
var NUMBERS_DAILY_FORCAST = 4;
// DASHBOARD CONFIGURATION 

var currentDate = new Date();
var sec;
var diff = (currentDate - COUNTDOWN_DATE)/1000
diff = Math.abs(Math.floor(diff));  
var days = Math.floor(diff/(24*60*60));
sec = diff - days * 24*60*60;
var hrs = Math.floor(sec/(60*60));
sec = sec - hrs * 60*60;
var min = Math.floor(sec/(60));
sec = sec - min * 60;
document.getElementsByClassName("number-days")[0].innerHTML = days;
document.getElementsByClassName("number-hours")[0].innerHTML = hrs;

function calendarDate(icalStr)  {
    var strYear = icalStr.substr(0,4);
    var strMonth = parseInt(icalStr.substr(4,2),10) - 1;
    var strDay = icalStr.substr(6,2);
    var strHour = icalStr.substr(9,2);
    var strMin = icalStr.substr(11,2);
    var strSec = icalStr.substr(13,2);
    var oDate =  new Date(strYear,strMonth, strDay, strHour, strMin, strSec)
    return oDate;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function displayEvent(events) {
    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var firstElemOnDay = true;
    var date = events[0].start;
    var str = "";
    events.forEach(function(elem) {
        if (date.getDay() != elem.start.getDay() || date.getMonth() != elem.start.getMonth() || date.getFullYear() != elem.start.getFullYear()) {
            firstElemOnDay = true;
            str += "</div>";
        }
        if (firstElemOnDay == true) {
            str += '<div class="day_container"><div class="day_title">' + weekday[elem.start.getDay()] + ' ' +  elem.start.getDate() + '</div>';
            firstElemOnDay = false;
            date = elem.start;
        }
        str += '<div class="event_container"><div class="event_left"><div class="event_hours_start">' + addZero(elem.start.getHours()) + 'h' + addZero(elem.start.getMinutes()) + '</div><div class="event_hours_end">' + addZero(elem.end.getHours()) + 'h' + addZero(elem.end.getMinutes()) + '</div></div><div class="event_right"><div class="event_title">' + elem.summary + '</div><div class="event_place">' + elem.location + '</div></div></div>';
    });
    $("div.item_schedule").html(str);
}

$.ajax({
    method: "GET",
    url: CALENDAR_URL,
    dataType: "text",
    crossDomain: true,
    async: false,
    success: function(data) {
        var events = [];
        var evs = data.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gi);
        evs.forEach(function(elem) {
            var summary = elem.match(/SUMMARY:.*/gi);
            if (summary !== null) {
                summary = summary[0].split(":")[1]
            }
            var location = elem.match(/LOCATION:.*/gi);
            if (location !== null) {
                location = location[0].split(":")[1]
            }
            var start = elem.match(/DTSTART;.*/gi);
            if (start !== null) {
                start = calendarDate(start[0].split(":")[1])
            }
            var end = elem.match(/DTEND;.*/gi);
            if (end !== null) {
                end = calendarDate(end[0].split(":")[1])
            }
            if (start !== null && start !== undefined && end !== null && end !== undefined){
                var now = new Date();
                if (start > now) {
                    var newStart = new Date(start);
                    var newEnd = new Date(end);
                    events.push({summary: summary, location: location, start: newStart, end: newEnd});
                }
                var rules = elem.match(/RRULE:FREQ=WEEKLY;UNTIL=.*/gi);
                if (rules !== null) {
                    var until = calendarDate(rules[0].split("UNTIL=")[1]);
                    while (start < until) {
                        start.setDate(start.getDate() + 7);
                        end.setDate(end.getDate() + 7);
                        var newStart = new Date(start);
                        var newEnd = new Date(end);
                        if (start > now && start < until) {
                            events.push({summary: summary, location: location, start: newStart, end: newEnd});
                        }
                    }
                }
            }
        });
        events.sort(function(a,b){
            var c = new Date(a.start);
            var d = new Date(b.start);
            return c-d;
        });
        displayEvent(events);
    }
});

var icons = {
    chanceflurries : "icon/freeze_cloud.svg",
    chancerain : "icon/rain.svg",
    chancesleet : "icon/rain.svg",
    chancesnow : "icon/snow.svg",
    chancetstorms  : "icon/lightning_cloud.svg",
    clear  : "icon/sun.svg",
    cloudy : "icon/cloudy.svg",
    flurries   : "icon/freeze_cloud.svg",
    fog : "icon/fog.svg",
    hazy : "icon/fog.svg",
    mostlycloudy   : "icon/cloud.svg",
    mostlysunny : "icon/sun_cloud.svg",
    partlycloudy : "icon/sun_cloud.svg",
    partlysunny : "icon/cloud.svg",
    sleet : "icon/rain.svg",
    rain   : "icon/rain.svg",
    sleet  : "icon/rain.svg",
    snow   : "icon/snow.svg",
    sunny  : "icon/sun.svg",
    tstorms : "icon/lightning_cloud.svg",
    unknown : "icon/unknown.svg",
}

$.ajax({
    method: "GET",
    url: "http://api.wunderground.com/api/" + WEATHER_UNDERGROUND_API_KEY + "/conditions/q/" + LATITUDE + "," + LONGITUDE + ".json",
    dataType: "jsonp",
    crossDomain: true,
    async: false,
    success: function(data) {
        $("span.temperature").html(Math.round(data.current_observation.temp_c));
        $("div.actual_temp_icon").html('<img src="' + icons[data.current_observation.icon] + '" width="100%" height="100%">');
    }
});

$.ajax({
    method: "GET",
    url: "http://api.wunderground.com/api/" + WEATHER_UNDERGROUND_API_KEY + "/hourly/q/" + LATITUDE + "," + LONGITUDE + ".json",
    dataType: "jsonp",
    crossDomain: true,
    async: false,
    success: function(data) {
        var i = 0;
        var str = "";
        data.hourly_forecast.forEach(function(elem) {
            if (i % HOURS_INTERVAL_DAILY_FORCAST == 0 && i < NUMBERS_DAILY_FORCAST * HOURS_INTERVAL_DAILY_FORCAST) {
                str += '<div class="hourly_forcast"><div class="hourly_forcast_hour">' + elem.FCTTIME.hour_padded + 'H</div><div class="hourly_forcast_temp">' + elem.temp.metric + '°C</div><div class="hourly_forcast_icon"><img src="' + icons[elem.icon] + '" width="60%"></div></div>';
            }
            i += 1;
        });
        $("div.meteo_today").html(str);
    }
});

$.ajax({
    method: "GET",
    url: "http://api.wunderground.com/api/" + WEATHER_UNDERGROUND_API_KEY + "/forecast10day/q/" + LATITUDE + "," + LONGITUDE + ".json",
    dataType: "jsonp",
    crossDomain: true,
    async: false,
    success: function(data) {
        var i = 0;
        var str = "";
        data.forecast.simpleforecast.forecastday.forEach(function(elem) {
            if (i == 1 || i == 2 || i == 3 || i == 4) {
                str += '<div class="forcast_day"><div class="forcast_day_title">' + elem.date.weekday + '</div><div class="forcast_day_min">' + elem.low.celsius + '°C</div><div class="forcast_day_max">' + elem.high.celsius + '°C</div><div class="forcast_day_icon"><img src="' + icons[elem.icon] + '" width="60%"></div></div>';
            }
            i += 1;
        });
        $("div.item_meteo_schedule").html(str);
    }
});

$.ajax({
    method: "GET",
    url: "http://api.airvisual.com/v2/nearest_city?lat=" + LATITUDE + "&lon=" + LONGITUDE + "&key=" + AIRVISUAL_API_KEY,
    crossDomain: true,
    async: false,
    dataType: "json",
    success: function(data) {
        $("div.item_aqi_current").html(data.data.current.pollution.aqius);
        $("div.item_aqi_where").html(data.data.city);
    }
});
