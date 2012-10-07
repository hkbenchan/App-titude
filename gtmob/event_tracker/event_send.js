$('#submitid').bind('click', function() 
{ console.log("Add Button");
      	$.ajax({
	    	url: "api/event/",
	        dataType: "json",
	        async: false, 
	        data: { "Title" : $('#enameid').val(), 
	        	"OrganizationName" : $('#eorganizationid').val(),
	        	"Email" : $('#eemailid').val(),
	        	"Phone" : $('#ephoneid').val(),
	        	"Contact" : $('#econtactid').val(),
	        	"Location" : $('#elocationid').val(),
	        	"LatCoord" : "",
	        	"LongCoord" : "",
	        	"EventTypeDesc" : $('#etypeid').val(),
	        	"Description" : $('#edescriptionid').val(),
	        	"StartTime" : $('#esyearid').val() + "-" +  $('#esmonthid').val() + "-" + $('#esdayid').val() + " " +  $('#eshourid').val() + ":" +  $('#esminid').val() + ":" +  $('#essecid').val(),
	       		"EndTime" : $('#eeyearid').val() + "-" +  $('#eemonthid').val() + "-" + $('#eedayid').val() + " " +  $('#eehourid').val() + ":" +  $('#eeminid').val() + ":" +  $('#eesecid').val(),
	        type: 'POST',
	        success: function(data) {
	        console.log("I am success");
	        },
	        error: ajaxError
       	});
});
