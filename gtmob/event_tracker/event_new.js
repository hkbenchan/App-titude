$(function() {
 		// Handler for .ready() called.
        console.log('ready');
 
        //Bind to the create so the page gets updated with the listing
        $('#lists_events_page').bind('pagebeforeshow',function(event, ui){
                console.log('pagebeforeshow');
        
                //Remove the old rows
                $( ".event_list_row" ).remove();
                
                //JQuery Fetch The New Ones
                $.ajax({
                        url: "api/event",
                        dataType: "json",
                async: false,
                success: function(data, textStatus, jqXHR) {
                                console.log(data);
                        //Create The New Rows From Template
                        $( "#event_list_row_template" ).tmpl( data ).appendTo( "#event_list" );
                },
                error: ajaxError
                });
                
                $('#event_list').listview('refresh');
        });

 
/******************************************************************************/
 
function ajaxError(jqXHR, textStatus, errorThrown){
        console.log('ajaxError '+textStatus+' '+errorThrown);
        $('#error_message').remove();
        $("#error_message_template").tmpl( {errorName: textStatus, errorDescription: errorThrown} ).appendTo( "#error_dialog_content" );
        $.mobile.changePage($('#error_dialog'), {
                transition: "pop",
                reverse: false,
                changeHash: false
        });
}