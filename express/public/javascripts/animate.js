//$(function(){
    $(document).ready(function(){
        $("#btn1").click(function(){
            $("#box").animate({height:"300px"},"slow", function(){
                $("p").text("Animated");
            });
        });
    });
//});