var repeticaoLed = "1"
var localLed ="S";
var localControle="S";

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


        var ipSend = $("#host2").val(); //var ipSend = "192.168.0.88";
        var saida = "ir?codigo=" + $(this).val() + "&repeticao=" + $(this).attr('repeticao') + "&local=" + localControle;
    }else{
        //Saida Arduino Mega
        //EX:ir?[repeticao][codigo][local]
        //repeticao =  $(this).attr('repeticao');
        //codigo = $(this).val()
        //local= localControle


        var ipSend = $("#host1").val(); //var ipSend = "192.168.15.46:8080";
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
         var ipSend = $("#host2").val(); //var ipSend = "192.168.0.88";
        var saida = "ir?codigo=" + $(this).val() + "&repeticao=" + $(this).attr('repeticao') + "&local=" + localLed;
    }else{
        //Saida Arduino Mega
        //EX:ir?[repeticao][codigo][local]
        //repeticao =  $(this).attr('repeticao');
        //codigo = $(this).val()
        //local= localLed
         var ipSend = $("#host1").val(); //var ipSend = "192.168.15.46:8080";
        var saida = "ir?" + $(this).attr('repeticao') + $(this).val() + localLed;
    }

    console.log(saida);
    console.log("http://"+ipSend+"/"+saida);
    $.post("http://"+ipSend+"/"+saida); 
});










$('#menu-por-locais button').on('click', function() {
    navigator.vibrate(20);
    
    if(localLed != "S"){
        var ipSend = $("#host2").val(); //var ipSend = "192.168.0.88";
        var saida = "ir?codigo=" + $(this).val() + "&repeticao=" + $(this).attr('repeticao') + "&local=" + localLed;
    }else{
        var ipSend = $("#host1").val(); //var ipSend = "192.168.15.46:8080";
        var saida = "ir?" + $(this).attr('repeticao') + $(this).val() + localLed;
    }
    console.log(saida);
    console.log("http://"+ipSend+"/"+saida);
    $.post("http://"+ipSend+"/"+saida); 
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
        localLed = "S";
        console.log(localLed);
    }
    if($(this).text() === "Escada"){
        $(".local-escada").removeClass("hide");
        $(".titulo-locais").html("Escada");
        localLed = "E";
        console.log(localLed);
    }
    if($(this).text() === "Crianças"){
        $(".local-criancas").removeClass("hide");
        $(".titulo-locais").html("Quarto Crianças");
        localLed = "K";
        console.log(localLed);
    }
    if($(this).text() === "Escritório"){
        $(".local-escritorio").removeClass("hide");
        $(".titulo-locais").html("Escritório");
        localLed = "M";
        console.log(localLed);
    }
    if($(this).text() === "Casal"){
        $(".local-casal").removeClass("hide");
        $(".titulo-locais").html("Quarto Casal");
        localLed = "C";
        console.log(localLed);
    }

    if($(this).text() === "Externas"){
        $(".local-externas").removeClass("hide");
        $(".titulo-locais").html("Áreas Externas");
        localLed = "F";
        console.log(localLed);
        $(".swith-led").removeClass('hide');
    }else{
        $(".swith-led").addClass('hide');
    }

});
