$(function(){
    $("#artist").on("change", function(){
        var name = $(this).val();
        var url = "/getAlbums?name=" + name;
        $.get(url, function(albums){
            console.log(albums)
            var html = "<option>All</option>";
            for(var i=0; i<albums.length; i++){
                html+="<option>" +albums[i] + "</option>";
            }
            $("#albums").html(html);
        });
    });


    $("#add-artist-btn").on("click", addArtist);

    $("#POST-name").on("keypress",function(e){
       if(e.which === 13){
           addArtist();
       }
    });
    var addArtist = function()  {
        $("#spinner").spin();
        var name = $("#POST-name").val();
        $.post("/addArtist", {artist: name}, function(){
            window.location.href = "/";
        });
    };
});


