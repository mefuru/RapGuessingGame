$(function() {
    console.log('this working');
    if(localStorage.getItem("attempted")) {
        localStorage.setItem("attempted", parseInt(localStorage.getItem("attempted"))+5);
        $('#attempted').html("You have attempted " + localStorage.getItem("attempted") + " questions");
    } else {
        localStorage.setItem("attempted", 5);
        $('#attempted').html("You have attempted " + localStorage.getItem("attempted") + " questions");
    }
    if(localStorage.getItem("correct")) {
        localStorage.setItem("correct", parseInt(localStorage.getItem("correct"))+ {{correctAnswers}} );
        $('#correct').html("You have " + localStorage.getItem("correct") + " correct answers");
    } else {
        localStorage.setItem("correct", {{correctAnswers}});
        $('#correct').html("You have " + localStorage.getItem("correct") + " correct answers");
    }
    if(localStorage.getItem("attempted") && localStorage.getItem("correct")) {
        localStorage.setItem("percentage", parseInt(localStorage.getItem("correct"))/parseInt(localStorage.getItem("attempted"))*100 );
        $('#percentage').html("You have " + localStorage.getItem("percentage") + "% correct answers");
    }
    $('#clearScores').click(function() {
        console.log('hello');
        localStorage.clear();
    });
});
