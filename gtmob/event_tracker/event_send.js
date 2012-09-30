$('#submitid').bind('click', function() 
{ console.log("Add Button");
      	$.ajax({
	    	url: "api/event",
	        dataType: "json",
	        async: false, 
	        data: { "Title" : $('#enameid').val(), 
	        	"OrganizationName" : $('#eorganizationid').val()},
	        	"Email" : $('#eemailid').val(),
	        	"Phone" : $('#ephoneid').val(),
	        	"Contact" : $('#econtactid').val(),
	        	"Location" : $('#elocationid').val(),
	        	"LatCoord" : "",
	        	"LongCoord" : "",
	        	"EventTypeDesc" : $('#etypeid').val(),
	        	"Description" : $('#edescriptionid').val(),
	        	"StartTime" : $('#estartid').val(),
	        	"EndTime" : $('#eendid').val()},
	        type: 'POST',
	        error: ajaxError
       	});
});
