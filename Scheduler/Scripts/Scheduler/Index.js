$(document).ready(function () {
    // Year
    $("#prevYear").click(function (e) { changeTime(-365); });
    $("#nextYear").click(function (e) { changeTime(365); });
    // Month
    $("#prevMonth").click(function (e) { changeTime(-30); });
    $("#nextMonth").click(function (e) { changeTime(30); });
    // Week
    $("#prevWeek").click(function (e) { changeTime(-7); });
    $("#nextWeek").click(function (e) { changeTime(7); });

    RenderSchedule();

    RegisterEvents();


});

var isDragging = false;

function RegisterEvents() {

    $(".activities").on('mousemove', '.minutes', function (e) {
        if (isDragging) {

            // if still in the same day
            var selected = $(".selected");
            if (selected.length > 0) {
                var id = $(selected[0]).attr('id');
                var selectedDay = id.substring(3, 4);
                var newDay = $(this).attr('id').substring(3, 4);
                if (selectedDay == newDay) {
                    $(this).addClass('selected');
                }
            } else {
                $(this).addClass('selected');
            }
        }
    });

    $(".activities").on('mousedown', '.minutes', function (e) {
        isDragging = true;
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    $(".activities").on('mouseup', '.minutes', function (e) {
        isDragging = false;
    });

}


function RenderSchedule() {

    var cells = $(".activities");
    var day = 1;
    $.each(cells, function (value, text) {

        // lets do every 30 minutes first
        // 12 hours
        // so 24 sections

        var i;
        for (i = 1; i <= 24; i++) {
            var minutes = i * 60;
            var html = '<div id="day' + day + '_' + minutes + '" class="minutes"></div>';
            $(text).append(html);
        }

        day++;
    });

    var i;
    for (i = 1; i <= 24; i++) {
        $("#times").append('<div>' + showHours(i * 60) + '</div>');
    }

}

function showHours(minutes) {
    var hours = Math.floor(minutes / 60);
    var modifier = "AM";
    if (hours > 11)
        modifier = "PM";
    if (hours > 12)
        hours = hours - 12;
    var min = minutes % 60;

    if (min < 10) min = "0" + min;
    //if(hours < 10) hours = "0"+hours;
    return hours + ":" + min + " " + modifier;
}


function UpdateView(date) {

    // add in a switch statement depending on view selection

    UpdateWeekView(date);

}

function UpdateWeekView(date) {
    var dow = date.day() + 1;
    date.subtract(date.day(), 'days'); // Go to beginning of week

    // Set Month and Year Values
    $("#month1").text(GetMonthName(date.month() + 1));
    $("#year1").text(date.year());
    $("#month1").attr('colspan', 7);
    $("#year1").attr('colspan', 7);

    // Hide / Clear second section
    $("#year2").hide(); $("#year2").text("");
    $("#month2").hide(); $("#month2").text("");

    var i;
    var last = date.clone();
    for (i = 1; i <= 7; i++) {
        $("#day" + i).text(date.date());
        if (last.month() != date.month()) {
            if (last.year() != date.year()) {
                $("#year1").attr('colspan', i - 1);
                $("#year2").show();
                $("#year2").attr('colspan', 7 - (i - 1));
                $("#year2").text(date.year());
            }

            $("#month1").attr('colspan', i - 1);
            $("#month2").show();
            $("#month2").attr('colspan', 7 - (i - 1));
            $("#month2").text(GetMonthName(date.month() + 1));
            last = date.clone();
        }
        if (i != 7) date.add(1, 'days');
    }
}



function changeTime(days) {

    // Gets first date on screen
    var date = GetDate();

    if (days == 365 || days == -365)
        date.add(days / 365, 'years');
    else if (days == 30 || days == -30)
        date.add(days / 30, 'months');
    else if (days == 7 || days == -7)
        date.add(days, 'days');

    // Update Screen
    UpdateView(date);
}

function GetDate() {
    var year = $("#year1").text().trim();
    var month = GetMonthNum($("#month1").text().trim());
    var day = $("#day1").text().trim();

    return moment(year + '-' + pad(month) + '-' + pad(day));
}

function pad(num) {
    var str = num + "";
    if (str.length == 1)
        return "0" + str;
    else
        return str;
}

function GetMonthNum(monthName) {
    // returns monthNum 0-11
    var months = ["January", "February", "March",
				  "April", "May", "June", "July",
				  "August", "September", "October",
				  "November", "December"];

    return months.indexOf(monthName) + 1;
}

function GetMonthName(monthNum) {
    // monthNum 0-11
    var months = ["January", "February", "March",
				  "April", "May", "June", "July",
				  "August", "September", "October",
				  "November", "December"];

    return months[monthNum - 1];
}