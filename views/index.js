$(document).ready(function(){
    const webexIntegrationDetails = window.localStorage.getItem('webexIntegrationKeys');
    if(webexIntegrationDetails){
        const {id, secret, redirectURI, scope} = JSON.parse(webexIntegrationDetails);
        //set parameter form
        $("#client-id").val(id);
        $("#client-secret").val(secret);
        $("#redirect-uri").val(redirectURI);
        $("#scope").val(scope);
        $('#remember-settings').prop('checked', true);
    }
})

$("#clear-settings").on('click', event=>{
    $("#client-id").val('');
        $("#client-secret").val('');
        $("#redirect-uri").val('');
        $("#scope").val('');
        $('#remember-settings').prop('checked', false);
})

$("#parameters-form").on('submit',event=>{
    event.preventDefault();
    const data = {
        id: $("#client-id").val(),
        secret: $("#client-secret").val(),
        scope: $("#scope").val(),
        redirectURI: $("#redirect-uri").val()
    }
    console.log(data)

    if($('#remember-settings').is(":checked")){
        if(window.localStorage.getItem('webexIntegrationKeys')){
            window.localStorage.removeItem('webexIntegrationKeys');
        } 
        window.localStorage.setItem('webexIntegrationKeys', JSON.stringify(data));
    }

    $.ajax("/api/start",{
        type: "POST",
        data: data
    }).then((response, error)=>{
        console.log(response);
        window.location.assign(response.initiateURL);
    }).then((res,error)=>{
        console.log(res.code);
    })
})

function copy2clipboard(text, btnEle){
    const copyTextArea = document.createElement("textarea");
    const orignalTooltip = btnEle.attr('data-original-title');
    copyTextArea.value = text;
    document.body.appendChild(copyTextArea);
    copyTextArea.select();
    // copyTextArea.setSelectRange(0,99999);
    document.execCommand("copy");
    btnEle.attr('data-original-title',`copied ${text}`).tooltip('show');
    document.body.removeChild(copyTextArea);
    btnEle.attr('data-original-title',orignalTooltip);
}

function copyTooltipMouseOver(tooltipEle){
    tooltipEle.html("Copy to clipboard");
}

// $("#access-code").on('click',copy2clipboard($("#access-code"),$("#tooltip-access-code")));
// $("#access-code").on('mouseout',copyTooltipMouseOver($("#access-code")));
$("#btn-access-token").tooltip();
$("#btn-access-token-expiry").tooltip();
$("#btn-refresh-token").tooltip();
$("#btn-refresh-token-expiry").tooltip();

$("#btn-access-token").on('click',event=>{
    copy2clipboard($('#access-token').val(),$("#btn-access-token"));
})

$("#btn-access-token-expiry").on('click',event=>{
    copy2clipboard($('#access-token-expiry').val(),$("#btn-access-token-expiry"));
})

$("#btn-refresh-token").on('click',event=>{
    copy2clipboard($('#refresh-token').val(),$("#btn-refresh-token"));
})

$("#btn-refresh-token-expiry").on('click',event=>{
    copy2clipboard($('#refresh-token-expiry').val(),$("#btn-refresh-token-expiry"));
})
