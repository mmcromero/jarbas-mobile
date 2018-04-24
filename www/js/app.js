/*DECLARAÇÃO DE VARIAVEIS*/
var repeticaoLed = "1"
var localLed ="S";
var localControle="S";
var ondeEstou="S";
var tipoConexao;


/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - INICIO*/
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);  
}

// device APIs are available
function onDeviceReady() {
    // wifi info
    WifiInfo.getWifiInfo(success,err);
    

    //file manager
    //console.log(cordova.file.applicationDirectory); 
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
        console.dir(f);
    }, fail);

    //This alias is a read-only pointer to the app itself
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/config.json", gotFile, fail);

}
/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - FIM*/



function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function gotFile(fileEntry) {

    fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
            //console.log("Text is: "+this.result);
            
            var obj = JSON.parse(this.result);
            console.log(obj);

            //preenche os campos
            $("#host1").val(obj.host1);
            $("#host-ext1").val(obj.host_ext1);
            $("#host2").val(obj.host2);
            $("#host-ext2").val(obj.host_ext2);
            $("#textarea").val(this.result);

        }

        reader.readAsText(file);
    });

}



/*    
    function createFile() {
       var type = window.TEMPORARY;
       var size = 5*1024*1024;
       window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

       function successCallback(fs) {
          fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
             alert('File creation successfull!')
          }, errorCallback);
       }

       function errorCallback(error) {
          alert("ERROR: " + error.code)
       }
        
    }


    function writeFile() {
       var type = window.TEMPORARY;
       var size = 5*1024*1024;
       window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

       function successCallback(fs) {
          fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

             fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                   alert('Write completed.');
                };

                fileWriter.onerror = function(e) {
                   alert('Write failed: ' + e.toString());
                };

                var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
                fileWriter.write(blob);
             }, errorCallback);
          }, errorCallback);
       }

       function errorCallback(error) {
          alert("ERROR: " + error.code)
       }
    }


    function readFile() {
       var type = window.TEMPORARY;
       var size = 5*1024*1024;
       window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

       function successCallback(fs) {
          fs.root.getFile('log.txt', {}, function(fileEntry) {

             fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                   var txtArea = document.getElementById('textarea');
                   txtArea.value = this.result;
                };
                reader.readAsText(file);
             }, errorCallback);
          }, errorCallback);
       }

       function errorCallback(error) {
          alert("ERROR: " + error.code)
       }
    }


    function removeFile() {
       var type = window.TEMPORARY;
       var size = 5*1024*1024;
       window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

       function successCallback(fs) {
          fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

             fileEntry.remove(function() {
                alert('File removed.');
             }, errorCallback);
          }, errorCallback);
       }

       function errorCallback(error) {
          alert("ERROR: " + error.code)
       }
    }
*/


/*$('#createFile').on('click', function(){
    console.log("click - bts - file manager");
    createFile();
});
$('#writeFile').on('click', function(){
    console.log("click - bts - file manager");
    writeFile();
});
$('#readFile').on('click', function(){
    console.log("click - bts - file manager");
    readFile();
});
$('#removeFile').on('click', function(){
    console.log("click - bts - file manager");
    removeFile();
});*/






function success(results) {
    //console.log(JSON.stringify(results));
    console.log("######### Wifi - Info - Plugin #########")
    console.log("SSID: "+results.SSID);
    console.log("IpAddress: "+results.IpAddress);
    console.log("MacAddress: "+results.MacAddress);
    console.log("")

    //mac adress meu cel: F0-D7-AA-E4-BD-B1
    //ip meu cel: 192.168.0.11

    //mac adress gi: A4-70-D6-E1-12-FC
    //ip cel gi: 192.168.0.16


    //alert(results.SSID);
    if(results.SSID == "\"Isengard\"" || results.SSID == "\"Fora-Temer-5g\"" || results.SSID == "\"Fora-Temer\""){
        tipoConexao = "interna";
    }else{
        tipoConexao = "externa";
    }
};
function err(e) {
    console.log(JSON.stringify(e));
};


function getHost(valor, repeticao, local){
    WifiInfo.getWifiInfo(success,err);
    //alert(tipoConexao);
    if(local != "S"){
        if(tipoConexao == "interna"){
            var ipSend = $("#host2").val(); 
        }else{
            var ipSend = $("#host-ext2").val(); 
            //alert("envio externo"); 

        }
        var saida = "ir?codigo=" + valor + "&repeticao=" + repeticao + "&local=" + local;
    }else{
        if(tipoConexao == "interna"){
            var ipSend = $("#host1").val(); 
        }else{
            var ipSend = $("#host-ext1").val();
            //alert("envio externo"); 
        }
        var saida = "ir?" + repeticao + valor + local;
    }
    var host="http://"+ipSend+"/"+saida;
    return host;
}

//inicializa bt do menu lateral
$(".button-collapse").sideNav();


/*EVENTOS DE CLICK*/
$('.lever').on('click', function(){
    navigator.vibrate(40);
});

$('#menu-controles button').on('click', function() {
    navigator.vibrate(20);
    if(localControle != "S"){

        //saida nodeMcu
        //EX:ir?codigo=1111&repeticao=2&local=S
        //codigo = $(this).val()
        //repeticao = repeticaoLed
        //local= localControle


        //var ipSend = $("#host2").val(); //var ipSend = "192.168.0.88";
        if(tipoConexao == "wifi"){
            var ipSend = $("#host2").val(); 
        }else{
            var ipSend = $("#host-ext2").val(); 
        }
        var saida = "ir?codigo=" + $(this).val() + "&repeticao=" + $(this).attr('repeticao') + "&local=" + localControle;
    }else{
        //Saida Arduino Mega
        //EX:ir?[repeticao][codigo][local]
        //repeticao =  $(this).attr('repeticao');
        //codigo = $(this).val()
        //local= localControle


        //var ipSend = $("#host1").val(); //var ipSend = "192.168.15.46:8080";
        if(tipoConexao == "wifi"){
            var ipSend = $("#host1").val(); 
        }else{
            var ipSend = $("#host-ext1").val(); 
        }
        var saida = "ir?" + $(this).attr('repeticao') + $(this).val() + localControle;
    }
    
    console.log(saida);
    console.log("http://"+ipSend+"/"+saida);
    $.post("http://"+ipSend+"/"+saida); 
});

$('#menu-leds button').on('click', function() {
    navigator.vibrate(20);
    
    if(localLed != "S"){

        //saida nodeMcu
        //EX:ir?codigo=1111&repeticao=2&local=S
        //codigo = $(this).val()
        //repeticao = repeticaoLed
        //local= localLed
        //var ipSend = $("#host2").val(); //var ipSend = "192.168.0.88";
        if(tipoConexao == "wifi"){
            var ipSend = $("#host2").val(); 
        }else{
            var ipSend = $("#host-ext2").val(); 
        }
        var saida = "ir?codigo=" + $(this).val() + "&repeticao=" + $(this).attr('repeticao') + "&local=" + localLed;
    }else{
        //Saida Arduino Mega
        //EX:ir?[repeticao][codigo][local]
        //repeticao =  $(this).attr('repeticao');
        //codigo = $(this).val()
        //local= localLed
        //var ipSend = $("#host1").val(); //var ipSend = "192.168.15.46:8080";
        if(tipoConexao == "wifi"){
            var ipSend = $("#host1").val(); 
        }else{
            var ipSend = $("#host-ext1").val(); 
        }
        var saida = "ir?" + $(this).attr('repeticao') + $(this).val() + localLed;
    }

    console.log(saida);
    console.log("http://"+ipSend+"/"+saida);
    $.post("http://"+ipSend+"/"+saida); 
});












$('#menu-por-locais button').on('click', function() {
    navigator.vibrate(20);

    var hostSend = getHost($(this).val(), $(this).attr('repeticao'), ondeEstou);
    console.log(hostSend);
    $.post(hostSend);
    //alert(hostSend);
});



$('.bt-menu-lateral').on('click', function(){
	$('.bt-menu-lateral').parent().removeClass('ativo');
	$(this).parent().addClass('ativo');
	$('.button-collapse').sideNav('hide');


    if($(this).hasClass("menu-controles")){
        $(".content-menu").addClass("hide");
        $("#menu-controles").removeClass("hide");
        console.log("menu controles");
    }
    if($(this).hasClass("menu-leds")){
        $(".content-menu").addClass("hide");
        $("#menu-leds").removeClass("hide");
        console.log("menu leds");
    }
    if($(this).hasClass("menu-lampadas")){
        $(".content-menu").addClass("hide");
        $("#menu-lampadas").removeClass("hide");
        console.log("menu lampadas");
    }
    if($(this).hasClass("menu-tomadas")){
        $(".content-menu").addClass("hide");
        $("#menu-tomadas").removeClass("hide");
        console.log("menu tomadas");
    }
    if($(this).hasClass("menu-configuracoes")){
        $(".content-menu").addClass("hide");
        $("#menu-configuracoes").removeClass("hide");
        console.log("menu configuracoes");
    }
    navigator.vibrate(30);
});

$('.link-submenu-controle').on('click', function(){
    $('.link-submenu-controle').parent().removeClass('ativo');
    $(this).parent().addClass('ativo');
    navigator.vibrate(30);
    
    if($(this).text() === "Sala"){
        localControle = "S";
    }
    if($(this).text() === "Crianças"){
        localControle = "K";
    }
    if($(this).text() === "Escritório"){
        localControle = "M";
    }
});

$('.link-submenu-led').on('click', function(){
    

    $('.link-submenu-led').parent().removeClass('ativo');
    $(this).parent().addClass('ativo');
    navigator.vibrate(30);

    
    if($(this).text() === "Sala"){
        localLed = "S";
        console.log(localLed);
    }
    if($(this).text() === "Escada"){
        localLed = "E";
        console.log(localLed);
    }
    if($(this).text() === "Crianças"){
        localLed = "K";
        console.log(localLed);
    }
    if($(this).text() === "Escritório"){
        localLed = "M";
        console.log(localLed);
    }
    if($(this).text() === "Casal"){
        localLed = "C";
        console.log(localLed);
    }

    if($(this).text() === "Externas"){
        localLed = "F";
        console.log(localLed);
        $(".swith-led").removeClass('hide');
    }else{
        $(".swith-led").addClass('hide');
    }

});




$('.link-locais').on('click', function(){
    console.log("click local");
    $(".content-menu").addClass("hide");
    $("#menu-por-locais").removeClass("hide");
    $('.button-collapse').sideNav('hide');
});


$('.link-submenu-locais').on('click', function(){
    

    $('.link-submenu-locais').parent().removeClass('ativo');

    $(".tabs-locais").addClass("hide");


    $(this).parent().addClass('ativo');
    navigator.vibrate(30);

    
    if($(this).text() === "Sala"){
        $(".local-sala").removeClass("hide");
        $(".titulo-locais").html("Sala");
        ondeEstou = "S";
        console.log(ondeEstou);
    }
    if($(this).text() === "Escada"){
        $(".local-escada").removeClass("hide");
        $(".titulo-locais").html("Escada");
        ondeEstou = "E";
        console.log(ondeEstou);
    }
    if($(this).text() === "Crianças"){
        $(".local-criancas").removeClass("hide");
        $(".titulo-locais").html("Quarto Crianças");
        ondeEstou = "K";
        console.log(ondeEstou);
    }
    if($(this).text() === "Escritório"){
        $(".local-escritorio").removeClass("hide");
        $(".titulo-locais").html("Escritório");
        ondeEstou = "M";
        console.log(ondeEstou);
    }
    if($(this).text() === "Casal"){
        $(".local-casal").removeClass("hide");
        $(".titulo-locais").html("Quarto Casal");
        ondeEstou = "C";
        console.log(ondeEstou);
    }

    if($(this).text() === "Externas"){
        $(".local-externas").removeClass("hide");
        $(".titulo-locais").html("Áreas Externas");
        ondeEstou = "F";
        console.log(ondeEstou);
        $(".swith-led").removeClass('hide');
    }else{
        $(".swith-led").addClass('hide');
    }

});



 





