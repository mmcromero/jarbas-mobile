/*DECLARAÇÃO DE VARIAVEIS*/
var repeticaoLed = "1"
var localLed ="S";
var localControle="S";
var ondeEstou="S";
var tipoConexao;
var fileDataConfig;


/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - INICIO*/
function onLoad() {
    $("#configInit").openModal();
    document.addEventListener("deviceready", onDeviceReady, false);  
}

// device APIs are available
function onDeviceReady() {
    // wifi info
    WifiInfo.getWifiInfo(success,err);

    //writeToFile('config.json', { host1: '192.168.0.7:8087', host_ext1: "romeropi.no-ip.org:8087", host2: "192.168.0.8:8088", host_ext2: "romeropi.no-ip.org:8088" });

    readFromFile('config.json', function (data) {
        fileDataConfig = data;

        //preenche os campos
        $("#host1").val(fileDataConfig.host1);
        $("#host-ext1").val(fileDataConfig.host_ext1);
        $("#host2").val(fileDataConfig.host2);
        $("#host-ext2").val(fileDataConfig.host_ext2);
        console.log(fileDataConfig)
    });
}
/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - FIM*/

function salvaConfig(){
    var host1 = $("#host1").val();
    var host2 = $("#host2").val();
    var host_ext1 = $("#host-ext1").val();
    var host_ext2 = $("#host-ext2").val();
    writeToFile('config.json', { host1: host1, host_ext1: host_ext1, host2: host2, host_ext2: host_ext2 });
    alert("Configurações Salvas");

    //volta pra tela inicial
    $(".content-menu").addClass("hide");
    $("#menu-por-locais").removeClass("hide");
    $('.button-collapse').sideNav('hide');

}

function readFromFile(fileName, cb) {
    var pathToFile = cordova.file.externalApplicationStorageDirectory + fileName;
    window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                cb(JSON.parse(this.result));
            };
            reader.readAsText(file);
        }, errorHandler.bind(null, fileName));
    }, errorHandler.bind(null, fileName));
}

function writeToFile(fileName, data) {
    data = JSON.stringify(data, null, '\t');
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (directoryEntry) {
        console.dir(directoryEntry);
        directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    // for real-world usage, you might consider passing a success callback
                    console.log('Write of file "' + fileName + '"" completed.');
                };

                fileWriter.onerror = function (e) {
                    // you could hook this up with our global error handler, or pass in an error callback
                    console.log('Write failed: ' + e.toString());
                };

                var blob = new Blob([data], { type: 'text/plain' });
                fileWriter.write(blob);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }, errorHandler.bind(null, fileName));
}

var errorHandler = function (fileName, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}


//-----------------------------------------------------------------
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

    if(results.SSID == "\"Isengard\"" || results.SSID == "\"Fora-Temer-5g\"" || results.SSID == "\"Fora-Temer\""){
        tipoConexao = "interna";
    }else{
        tipoConexao = "externa";
    }
};
function err(e) {
    console.log(JSON.stringify(e));
};
//---------------------------------------------------------------

function getHost(valor, repeticao, local){
    console.log(tipoConexao);
    if(local != "S"){
        if(tipoConexao == "interna"){
            var ipSend = $("#host2").val(); 
        }else{
            var ipSend = $("#host-ext2").val(); 
            console.log("envio externo"); 
        }
        var saida = "ir?codigo=" + valor + "&repeticao=" + repeticao + "&local=" + local;
    }else{
        if(tipoConexao == "interna"){
            var ipSend = $("#host1").val(); 
        }else{
            var ipSend = $("#host-ext1").val();
            console.log("envio externo"); 
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
    WifiInfo.getWifiInfo(success,err);
    navigator.vibrate(20);
    var hostSend = getHost($(this).val(), $(this).attr('repeticao'), ondeEstou);
    console.log(hostSend);
    $.post(hostSend);
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



$('.bt-salvar').on('click', function(){
    salvaConfig();
});



