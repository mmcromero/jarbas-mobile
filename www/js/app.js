
//mac adress meu cel: F0-D7-AA-E4-BD-B1
    //ip meu cel: 192.168.0.11
    //Id Device: e75ed4ac-a0bb-6777-3581-970754598108

    //mac adress gi: A4-70-D6-E1-12-FC
    //ip cel gi: 192.168.0.16
    //Id Device: 6cf00b78-5526-4cb6-3541-470711745118


//$("#config").closeModal();



/*DECLARAÇÃO DE VARIAVEIS*/
var repeticaoLed = "1"
var localLed ="S";
var localControle="S";
var ondeEstou="S";
var fileDataConfig;
var tipoUser=0;
var count=0;

/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - INICIO*/
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);  
    document.addEventListener("backbutton",btVoltar, false);
    document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);
    document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);



    

    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

    var obj = {
        id_device:"init",
        nome_user:"",
        email_user:"",
        senha_user:"",
        host1:"",
        host_ext1:"",
        host2:"",
        host_ext2:"",
        tipo_conexao:"",
        local:""
    };

    fileDataConfig = obj;
    console.log("Criado obj: "+fileDataConfig);
    console.log(fileDataConfig);
}

// device APIs are available
function onDeviceReady() {
    /*
    ####FLUXO
    -leio json de config
        se não existe 
            -verifico se é um despositivo conhecido
    -verifico tipo de conexão
    */

    getJsonConfiguracoes("full");

/*    console.log("carregando arquivo de config...");
    readFromFile('config.json', function (data) {
        fileDataConfig = data;
    });*/
    
}
/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - FIM*/

function onVolumeDownKeyDown() {
    // Handle the volume down button
    console.log("abaixa sub");
    hostSend("S","1587664935","1");
}

function onVolumeUpKeyDown() {
    // Handle the volume up button
    console.log("sob sub");
    hostSend("S","1587632295","1");
}

function onOnline() {
    // Handle the online event
    console.log("ficou online");
    getWifiInfo();
}
function onOffline() {
    // Handle the offline event
    console.log("ficou offLine");
    getWifiInfo();
}

function btVoltar(){
    console.log("apertou voltar");
    //code here
    if(count == 0){
        console.log("fecho modal caso exista");
        $("#config").closeModal();
        count++;
    }else{
        count=0;
        //na segunda vez apos fechar o modal
        // faz modal de confirmação de saida
        alert("desja sair");
        //navigator.app.exitApp();
    }
}

var configInicial = function(){
    //crio o json
    //fileDataConfig = [{ id_device: '' , nome_user: '' , email_user: '' , senha_user: '' , host1: '' , host_ext1: '' , host2: '' , host_ext2: '' , tipo_conexao: '' , local: ''  }];

    

    


    //abro modal
    $("#configInit").openModal();
}

var lerVarConfigLocal = function(){
    console.log(fileDataConfig);

        /*fileDataConfig.id_device;
        fileDataConfig.nome_user;
        fileDataConfig.email_user;
        fileDataConfig.senha_user;
        fileDataConfig.host1;
        fileDataConfig.host_ext1;
        fileDataConfig.host2;
        fileDataConfig.host_ext2;
        fileDataConfig.tipo_conexao;
        fileDataConfig.local;*/

        $("#host1-init").val(fileDataConfig.host1);
        $("#host2-init").val(fileDataConfig.host2);
        $("#host-ext1-init").val(fileDataConfig.host_ext1);
        $("#host-ext2-init").val(fileDataConfig.host_ext2);


        $("#host1").val(fileDataConfig.host1);
        $("#host2").val(fileDataConfig.host2);
        $("#host-ext1").val(fileDataConfig.host_ext1);
        $("#host-ext2").val(fileDataConfig.host_ext2);
}

var escreverVarConfigLocal = function(chave, valor){
    fileDataConfig[chave] = valor;
    lerVarConfigLocal();

}


function getJsonConfiguracoes(tipo){
    console.log("carregando arquivo de config...");
    readFromFile('config.json', function (data) {
        fileDataConfig = data;

        console.log("arquivo carregado..");
         console.log(fileDataConfig)
                
        //preenche os campos
        $("#host1").val(fileDataConfig.host1);
        $("#host-ext1").val(fileDataConfig.host_ext1);
        $("#host2").val(fileDataConfig.host2);
        $("#host-ext2").val(fileDataConfig.host_ext2);

        if(tipo == "full"){
                    console.log("tipo full");
                    window.plugins.uniqueDeviceID.get(successId, failId);
                }
        
    },tipo);
    
}


function readFromFile(fileName, cb, tipo) {
    var pathToFile = cordova.file.externalApplicationStorageDirectory  + fileName;
    window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                cb(JSON.parse(this.result),tipo);
                

               
            };
            reader.readAsText(file);
        }, errorHandler.bind(null, fileName));
    }, errorHandler.bind(null, fileName));
    console.log("lendo json...");

}
function salvaConfig(tipo){
    if(tipo == "init"){
        var host1 = $("#host1-init").val();
        var host2 = $("#host2-init").val();
        var host_ext1 = $("#host-ext1-init").val();
        var host_ext2 = $("#host-ext2-init").val();
        var $toastContent = '<span>Configurações iniciais salvas</span>';
    }else{
        var host1 = $("#host1").val();
        var host2 = $("#host2").val();
        var host_ext1 = $("#host-ext1").val();
        var host_ext2 = $("#host-ext2").val();
        var $toastContent = '<span>Configurações Salvas</span>';
    }

    fileDataConfig.host1 = host1;
    fileDataConfig.host_ext1 = host_ext1;
    fileDataConfig.host2 = host2;
    fileDataConfig.host_ext2 = host_ext2;
     
    console.log("tenta salvar");
    writeToFile('config.json', { host1: host1, host_ext1: host_ext1, host2: host2, host_ext2: host_ext2 });
    console.log("salvou???");
    Materialize.toast($toastContent, 3000, "green altura-80");
    //lerArquivoConfig();
    //getJsonConfiguracoes();
}
function writeToFile(fileName, data) {
    data = JSON.stringify(data, null, '\t');
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory , function (directoryEntry) {
        console.dir(directoryEntry);
        directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    // for real-world usage, you might consider passing a successs callback
                    console.log('Write of file "' + fileName + '"" completed.');
                    console.log(data);
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
            //não exite arquivo de config... executa config inicial
            configInicial();
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
    window.plugins.uniqueDeviceID.get(successId, failId);

}
//-----------------------------------------------------------------
function successId(uuid){
    console.log("Id Device: "+uuid);
    if(uuid == "e75ed4ac-a0bb-6777-3581-970754598108"){
        fileDataConfig.id_device = "e75ed4ac-a0bb-6777-3581-970754598108";
        fileDataConfig.nome_user = "Marco";
        fileDataConfig.email_user = "mmcromero@gmail.com";
        fileDataConfig.senha_user = "rcmmocram";
        fileDataConfig.host1 = "192.168.0.7:8087";
        fileDataConfig.host2 = "";
        fileDataConfig.host_ext1 = "";//"romeropi.no-ip.org:8087";
        fileDataConfig.host_ext2 = "";

        lerVarConfigLocal();
        console.log("Olá Marco !!!");
        tipoUser=1;
        //alert("Olá Marco!");
    }else if(uuid == "6cf00b78-5526-4cb6-3541-470711745118"){
        console.log("Olá Gisele !!!");
        tipoUser=1;
        alert("Olá Gi! S2 S2 S2");
    }else{
        console.log("Olá visitante !!!");
        tipoUser=0;
        alert("Olá visitante, esse é um alert chato =P");
    }
    getWifiInfo(true);
}

function failId(erro){
    console.log("Erro id: "+erro);
    getWifiInfo();
}
//-----------------------------------------------------------------
function getWifiInfo(log){
    if(log){
        console.log("Consulta Wifi com Log");
        WifiInfo.getWifiInfo(successWifiInfo,erroWifiInfo);
    }else{
        WifiInfo.getWifiInfo(successWifi,erroWifiInfo);
    }
}

function successWifiInfo(results) {
    fileDataConfig.tipo_conexao = lolgicaEscolhaRede(results);
    //console.log(JSON.stringify(results));
    console.log("######### Wifi - Info - Plugin #########")
    console.log("SSID: "+results.SSID);
    console.log("IpAddress: "+results.IpAddress);
    console.log("Tipo conexão : "+fileDataConfig.tipo_conexao);
    console.log("atualizando json local");


};
function successWifi(results) {
    fileDataConfig.tipo_conexao = lolgicaEscolhaRede(results);

};
function erroWifiInfo(e) {
    console.log("Erro na verificação de conexão: "+JSON.stringify(e));
};

function lolgicaEscolhaRede(results){
    var retornotipoConexao;
    if(results.SSID == "\"Isengard\"" || results.SSID == "\"Fora-Temer-5g\"" || results.SSID == "\"Fora-Temer\""){
        retornotipoConexao = "interna";
        //muda o icone
        $(".icoTipoConexao").text("wifi");
    }else{
        retornotipoConexao = "externa";
        //muda o icone
        $(".icoTipoConexao").text("cloud_queue");
    }

    return retornotipoConexao;
}
//---------------------------------------------------------------

function getHostJson(local){
    if(local != "S"){
        if(fileDataConfig.tipo_conexao == "interna"){
            data = fileDataConfig.host2
        }else if(fileDataConfig.tipo_conexao == "externa"){
            data = fileDataConfig.host_ext2 
        }else{
            console.log("tipo conexao indefinida");
        }

    }else{
        if(fileDataConfig.tipo_conexao == "interna"){
            var data = fileDataConfig.host1
        }else if(fileDataConfig.tipo_conexao == "externa"){
            var data = fileDataConfig.host_ext1 
        }else{
            console.log("tipo conexao indefinida");
        } 
    }
    return data;
}

function getSaida(valor, repeticao, local){
    if(local != "S"){
        data = "ir?codigo=" + valor + "&repeticao=" + repeticao + "&local=" + local;
    }else{
        data = "ir?" + repeticao + valor + local;
    }
    return data;
}
function getUrl(valor, repeticao, local){
    var ipSend;
    var saida;
    var url;

    getWifiInfo();
    ipSend = getHostJson(local);
    if(ipSend == ""){
        
        if(fileDataConfig.tipo_conexao == "interna"){
            if(local != "S"){
                tipoHost = "Host 2";
            }else{
                tipoHost = "Host 1";
            }
        }else if(fileDataConfig.tipo_conexao == "externa"){
            if(local != "S"){
                tipoHost = "Host Exteno 2";
            }else{
                tipoHost = "Host Exteno 1";
            }
        }
        var $toastContent = '<span class="" style="width: 200px;">'+tipoHost+' não informado</span><button class="btn-flat waves-effect waves-light grey darken-3 white-text btToastConfig">Configurações</button>';
        Materialize.toast($toastContent, 3000, 'red altura-80');
        console.log("sem informação de "+tipoHost+", informação enviada por toast com atalho para area de configurações");
        //bt toast de config
        $(".btToastConfig").on("click",function(){
            $(".toast").remove();
            console.log("click toast de config");
            getJsonConfiguracoes();
            $("#config").openModal();
        });

    }else{
        console.log("retorno getHostJson: "+ipSend);
        saida = getSaida(valor, repeticao, local);
        console.log("retorno getSaida: "+saida);
        var url="http://"+ipSend+"/"+saida;
    }
    return url;
}


function hostSend(local,valor,repeticao){
    var url = getUrl(valor, repeticao, local);
    
    if(url){
        console.log("Send POST: "+url);
        $.post(url);
    }else{
        //faz os tratamentos de erro
        console.log("host não definido");
        console.log("Retorno do getUrl: "+url);
        //

    }


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
        if(fileDataConfig.tipo_conexao == "wifi"){
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
        if(fileDataConfig.tipo_conexao == "wifi"){
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
        if(fileDataConfig.tipo_conexao == "wifi"){
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
        if(fileDataConfig.tipo_conexao == "wifi"){
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
    
    var valor=$(this).val();
    var repeticao=$(this).attr('repeticao');
    var local = ondeEstou;
    //chama func de envio
    hostSend(local,valor,repeticao);

    
    /*  
    var hostSend = getUrl($(this).val(), $(this).attr('repeticao'), ondeEstou);
    console.log(hostSend);
    $.post(hostSend);
    */
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
        //lerArquivoConfig();
        getJsonConfiguracoes();
        $("#config").openModal();
    }
    navigator.vibrate(30);
});





/*############## ABA DE SELEÇÃO DELOCAIS por categorias ############## - INICIO */
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
/*############## ABA DE SELEÇÃO DELOCAIS por categorias ############## - FIM */



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
$('.bt-salvar-init').on('click', function(){
    salvaConfig("init");
});


