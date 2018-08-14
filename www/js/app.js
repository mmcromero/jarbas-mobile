
//mac adress meu cel: F0-D7-AA-E4-BD-B1
    //ip meu cel: 192.168.0.11
    //Id Device: dfae2dba-836f-6f8b-0895-505311200227

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
var verificaConexao;
var arduinoNaoFuncionaPraPauNoCu = 0;


/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - INICIO*/
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);  
    document.addEventListener("backbutton",btVoltar, false);
    document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);
    document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);

    document.addEventListener("resume", onResume, false);

    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

    var obj = {
        id_device:"init",
        ip_device:"000.000.000",
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
    getJsonConfiguracoes("full");
}
/*VERIFICA DISPONIBILIDADE DAS APIS DO DISPOSITIVO - FIM*/







///// EVENTOS DO CELULAR
function onResume() {
    // Handle the resume event
   // alert("retorno com segurança");
}

function onVolumeDownKeyDown() {
    console.log("abaixa sub");
    hostSend("S","1587664935","1");
}
function onVolumeUpKeyDown() {
    console.log("sob sub");
    hostSend("S","1587632295","1");
}
function btVoltar(){
    console.log("apertou voltar");

    if($('#config').is(':visible')){
        $("#config").closeModal();
    }else if($('#configInit').is(':visible')){
        console.log("tela de config inicial, bt voltar sem ação");
    }else{
        
        $("#modalSaida").openModal();
        //js de tratamento dos botoes sim e não
        $(".bt-sair-sim").on("click", function(){
            navigator.app.exitApp();
        });
        $(".bt-sair-nao").on("click", function(){
            $("#modalSaida").closeModal();
        });


    }
}
function onOnline() {
    console.log("ficou online");
    getWifiInfo();
}
function onOffline() {
    console.log("ficou offLine");
    getWifiInfo();
}
/////////////////////////



var configInicial = function(){
    //abro modal
    $("#config").openModal();
    $("#config h5").text("Configuração inicial");
    $("#config p:first").text("Não foi localizada as informações de hosts, informe-as nos campos a baixo.");
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
       
    if(uuid == "907fbb5e-6070-9932-3541-060922796188"){
        if(fileDataConfig.id_device == "init"){
            fileDataConfig.id_device = uuid;
            fileDataConfig.nome_user = "Marco";
            fileDataConfig.email_user = "mmcromero@gmail.com";
            fileDataConfig.senha_user = "rcmmocram";
            fileDataConfig.host1 = "192.168.0.7:8087";
            fileDataConfig.host2 = "192.168.0.8:8088";
            fileDataConfig.host_ext1 = "romeropi.no-ip.org:8087";//"romeropi.no-ip.org:8087";
            fileDataConfig.host_ext2 = "romeropi.no-ip.org:8088";
        }

        lerVarConfigLocal();
        console.log("Olá Marco !!!");
        //alert("Olá Marco!");
         arduinoNaoFuncionaPraPauNoCu = 0;
    }else if(uuid == "6cf00b78-5526-4cb6-3541-470711745118"){
        if(fileDataConfig.id_device == "init"){
            fileDataConfig.id_device = uuid;
            fileDataConfig.nome_user = "Gisele";
            fileDataConfig.email_user = "gisacsoli@gmail.com";
            fileDataConfig.senha_user = "gigi21";
            fileDataConfig.host1 = "192.168.0.7:8087";
            fileDataConfig.host2 = "192.168.0.8:8088";
            fileDataConfig.host_ext1 = "romeropi.no-ip.org:8087";//"romeropi.no-ip.org:8087";
            fileDataConfig.host_ext2 = "romeropi.no-ip.org:8088";
        }

        lerVarConfigLocal();
        console.log("bummmmm");
        arduinoNaoFuncionaPraPauNoCu = 1;
        //alert("Olá Gi! S2 S2 S2");
    }else{

        /*if(fileDataConfig.id_device == "init"){
            fileDataConfig.id_device = uuid;
            fileDataConfig.nome_user = "-USER-";
            fileDataConfig.email_user = "";
            fileDataConfig.senha_user = "";
            fileDataConfig.host1 = "";
            fileDataConfig.host2 = "";
            fileDataConfig.host_ext1 = "";//"romeropi.no-ip.org:8087";
            fileDataConfig.host_ext2 = "";
        }
        console.log("Olá visitante !!!");
        alert("Olá visitante, esse é um alert chato =P");*/
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
    console.log(JSON.stringify(results));
    console.log("######### Wifi - Info - Plugin #########")
    console.log("SSID: "+results.SSID);
    console.log("IpAddress: "+results.IpAddress);
    console.log("Tipo conexão : "+fileDataConfig.tipo_conexao);
    console.log("atualizando json local");
    fileDataConfig.ip_device = results.IpAddress;
    //console.log(fileDataConfig.ip_device); 

     /*if(fileDataConfig.ip_device == "192.168.0.11"){
        if(fileDataConfig.id_device == "init"){
            fileDataConfig.id_device = "undefined";
            fileDataConfig.nome_user = "Marco";
            fileDataConfig.email_user = "mmcromero@gmail.com";
            fileDataConfig.senha_user = "rcmmocram";
            fileDataConfig.host1 = "192.168.0.7:8087";
            fileDataConfig.host2 = "";
            fileDataConfig.host_ext1 = "romeropi.no-ip.org:8087";//"romeropi.no-ip.org:8087";
            fileDataConfig.host_ext2 = "";
        }

        lerVarConfigLocal();
        console.log("Olá Marco !!!");
        //alert("Olá Marco!");
        //arduinoNaoFuncionaPraPauNoCu = 1;
     }else{

        if(fileDataConfig.id_device == "init"){
            fileDataConfig.id_device = "undefined";
            fileDataConfig.nome_user = "-USER-";
            fileDataConfig.email_user = "";
            fileDataConfig.senha_user = "";
            fileDataConfig.host1 = "";
            fileDataConfig.host2 = "";
            fileDataConfig.host_ext1 = "";//"romeropi.no-ip.org:8087";
            fileDataConfig.host_ext2 = "";
        }
        console.log("Olá visitante !!!");
        alert("Olá visitante, esse é um alert chato =P");
    } */
};
function successWifi(results) {
    fileDataConfig.tipo_conexao = lolgicaEscolhaRede(results);
};
/*function getIp(results) {
    console.log("aqui...");
    fileDataConfig.ip_device = results.IpAddress;
};*/
function erroWifiInfo(e) {
    console.log("Erro na verificação de conexão: "+JSON.stringify(e));
};

function lolgicaEscolhaRede(results){
    var retornotipoConexao;

    if(navigator.connection.type !== "none"){
        if(results.SSID == "\"Isengard\"" || results.SSID == "\"Fora-Temer-5g\"" || results.SSID == "\"Fora-Temer\"" || results.IpAddress != "0.0.0.0"){
            retornotipoConexao = "interna";
            //muda o icone
            $(".icoTipoConexao").text("wifi");
            $(".icoTipoConexao").removeClass("red-text");
        }else{
            retornotipoConexao = "externa";
            //muda o icone
            $(".icoTipoConexao").text("cloud_queue");
            $(".icoTipoConexao").removeClass("red-text");
        }
    }else{
        $(".icoTipoConexao").text("signal_wifi_off");
        $(".icoTipoConexao").addClass("red-text");
        retornotipoConexao = "offline";
        //toast de aviso "sem conexão"
        var $toastContent = '<span>Sem conexões ativas !</span>';
        Materialize.toast($toastContent, 3000, "red altura-80");
    }
    return retornotipoConexao;
}
//---------------------------------------------------------------

function getTipoHost(){
    if(fileDataConfig.tipo_conexao == "interna"){
        //if(ondeEstou != "S"){
           // tipoHost = "Host 2";
       // }else{
            tipoHost = "Host 1";
       // }
    }else if(fileDataConfig.tipo_conexao == "externa"){
       // if(ondeEstou != "S"){
           // tipoHost = "Host Exteno 2";
       // }else{
            tipoHost = "Host Exteno 1";
       // }
    } 
    return tipoHost;
}

function getHostJson(local){
   // if(local != "S"){
        if(fileDataConfig.tipo_conexao == "interna"){
            //data = fileDataConfig.host2
            data = fileDataConfig.host1

        }else if(fileDataConfig.tipo_conexao == "externa"){
            //data = fileDataConfig.host_ext2 
            data = fileDataConfig.host_ext1
        }else{
            console.log("tipo conexao indefinida");
        }

   /* }else{
        if(fileDataConfig.tipo_conexao == "interna"){
            var data = fileDataConfig.host1
        }else if(fileDataConfig.tipo_conexao == "externa"){
            var data = fileDataConfig.host_ext1 
        }else{
            console.log("tipo conexao indefinida");
        } 
    }*/
    return data;
}

function getSaida(valor, repeticao, local){
    //if(local != "S"){
        //data = "ir?codigo=" + valor + "&repeticao=" + repeticao + "&local=" + local;
        
        if(repeticao != "rele"){
            data = "ir?" + repeticao + valor + local;
        }else{
            data = "rele?" +  valor ;
        }
   //}else{
    //    if(repeticao != "rele"){
            //data = "ir?" + repeticao + valor + local;
    //    }else{
   //         data = "rele?" +  valor ;
    //    }
    //}
    return data;
}
function getUrl(valor, repeticao, local){
    var ipSend;
    var saida;
    var url;

    getWifiInfo();
    ipSend = getHostJson(local);
    if(ipSend == ""){
        
        var tipoHost = getTipoHost();
        var $toastContent = '<span class="" style="width: 200px;">'+tipoHost+' não informado</span><button class="btn-flat waves-effect waves-light grey darken-3 white-text btToastConfig">Configurações</button>';
        Materialize.toast($toastContent, 3000, 'red altura-80');
        console.log("sem informação de "+tipoHost+", informação enviada por toast com atalho para area de configurações");
        //bt toast de config
        $(".btToastConfig").on("click",function(){
            $(".toast").remove();
            console.log("click toast de config");
            getJsonConfiguracoes();
            $("#config").openModal();
            $("#config h5").text("Configurações");
            $("#config p:first").text("Utilize essa tela para atualizar as informações de host's.");

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

        if(arduinoNaoFuncionaPraPauNoCu == 0){
            console.log("Send POST: "+url);
            //$.post(url);

            $.ajax({
                beforeSend: function() {  
                    

                },
                type: "POST",  
                url: url,
                success: function(data){ 

                    console.log("retorno do ajax de envio de comando para arduino: ");
                    console.log(data);
                    navigator.vibrate(20);  
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("erro do ajax de envio de comando para arduino: "); 
                    console.log(XMLHttpRequest); 
                    console.log(textStatus); 
                    navigator.vibrate(100);

                    var tipoHost = getTipoHost();
                    
                    var $toastContent = '<span>'+tipoHost+' não respode...</span>';
                    Materialize.toast($toastContent, 2000, "red altura-80"); 
           
                },
                timeout: 1000 // sets timeout to 3 seconds       
            });
        }else{
            alert("Bummmmmm, desejo realizado.... ;(");
        }
        


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

/*$('#menu-controles button').on('click', function() {
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
});*/


/*$('#menu-por-locais button').on('click', function() {
    console.log("Envia Rele");
    var valor=$(this).val();
    var repeticao="rele";
    var local = "";

    hostSend(local,valor,repeticao);
});*/

$('#menu-por-locais button, #seguranca button').on('click', function() {
    //navigator.vibrate(20);

    if($(this).hasClass("bt-rele") ){ //
        console.log("Envia Rele");
        var valor=$(this).val();
        var repeticao="rele";
        var local = "";

        hostSend(local,valor,repeticao);
    }else{
        var valor=$(this).val();
        var repeticao=$(this).attr('repeticao');
        var local = ondeEstou;
        //chama func de envio
        hostSend(local,valor,repeticao);
    }
    
    

    
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
    if($(this).hasClass("menu-seguranca")){
        $("#seguranca").openModal();
    }
 



    if($(this).hasClass("menu-configuracoes")){
        //lerArquivoConfig();
        //getJsonConfiguracoes();
        lerVarConfigLocal();

        $("#config").openModal();
        $("#config h5").text("Configurações");
        $("#config p:first").text("Utilize essa tela para atualizar as informações de host's.");


        /// se estiver na conexão externa eu não verifico os servidores externos
        if(fileDataConfig.tipo_conexao !== "externa"){
            if($("#host1").val() != ""){
                console.log($("#host1").val());
                var valor=$("#host1").val();
                var icone=$("#host1").attr("data-id-ico");
                pingHosts(valor, icone);
            }
            if($("#host2").val() != ""){
                console.log($("#host2").val());
                var valor=$("#host2").val();
                var icone=$("#host2").attr("data-id-ico");
                pingHosts(valor, icone);
            }
        }else{
            $(".ico-host1").text("signal_wifi_off");
            $(".ico-host1").removeClass("red-text");
            $(".ico-host1").removeClass("green-text");

            $(".ico-host2").text("signal_wifi_off");
            $(".ico-host2").removeClass("red-text");
            $(".ico-host2").removeClass("green-text");
        }
        
        if($("#host-ext1").val() != ""){
            var valor=$("#host-ext1").val();
            var icone=$("#host-ext1").attr("data-id-ico");
            pingHosts(valor, icone);
        }
        if($("#host-ext2").val() != ""){
            var valor=$("#host-ext2").val();
            var icone=$("#host-ext2").attr("data-id-ico");
            pingHosts(valor, icone);
        }
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
        ondeEstou = "M";
        console.log(ondeEstou);
        $(".swith-led").removeClass('hide');
    }else{
        $(".swith-led").addClass('hide');
    }
});



$('.bt-salvar').on('click', function(){
    salvaConfig();
});



var pingHosts = function(valor, icone){

    var ipSend = "http://"+valor;
    var icoClass = icone;
    console.log(icoClass);
    console.log(ipSend);

    $.ajax({
        beforeSend: function() {  
            var spinner = "<div class='preloader-wrapper small active'><div class='spinner-layer spinner-yellow-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>";
            $("."+icoClass).html(spinner);
            $("."+icoClass).removeClass("red-text");
            $("."+icoClass).removeClass("green-text");

        },
        type: "POST",  
        url: ipSend,
        success: function(data){ 

            console.log(data);  
            verificaConexao = data;

            $("."+icoClass).text("wifi");
            $("."+icoClass).addClass("green-text");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 

            $("."+icoClass).text("signal_wifi_off");
            $("."+icoClass).addClass("red-text");
            console.log("erro ajax"); 
            console.log(XMLHttpRequest); 
            console.log(textStatus);  
            console.log(errorThrown);    
        },
        timeout: 3000 // sets timeout to 3 seconds       
    });
}


//// on blur dos campos de host, verifica se o host esta on line
$("#host1, #host2").on("blur", function(){
    if(fileDataConfig.tipo_conexao !== "externa"){
        var valor=$(this).val();
        var icone=$(this).attr("data-id-ico");
        pingHosts(valor, icone);
    }else{
        $(".ico-host1").text("signal_wifi_off");
        $(".ico-host1").removeClass("red-text");
        $(".ico-host1").removeClass("green-text");

        $(".ico-host2").text("signal_wifi_off");
        $(".ico-host2").removeClass("red-text");
        $(".ico-host2").removeClass("green-text");
    }
});

$("#host-ext1, #host-ext2").on("blur", function(){
    var valor=$(this).val();
    var icone=$(this).attr("data-id-ico");
    pingHosts(valor, icone);
});


///click no icone de conexão faz verificação no tipo de conexão
$('.icoTipoConexao').on('click', function(){
    var $toastContent = '<span class="black-text">Atualizando informações de conexões...</span>';
    Materialize.toast($toastContent, 3000, "yellow darken-1 altura-80");
    getWifiInfo();
});

