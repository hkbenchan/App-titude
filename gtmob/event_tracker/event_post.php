<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Event Post</title>
		
		<script type="text/javascript" src="../jquery-1.8.2.js"></script>
		<script type="text/javascript" src="../jquery.mobile-1.1.1.js"></script>
		<script type="text/css" src="../jquery.mobile.structure-1.1.1.css"></script>
		<script type="text/css" src="../jquery.mobile.theme-1.1.1.css"></script>

		<!--CSS file (default YUI Sam Skin) -->
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.9.0/build/calendar/assets/skins/sam/calendar.css" />
		 
		<!-- Dependencies -->
		<script src="http://yui.yahooapis.com/2.9.0/build/yahoo-dom-event/yahoo-dom-event.js"></script>
		 
		<!-- Source file -->
		<script src="http://yui.yahooapis.com/2.9.0/build/calendar/calendar-min.js"></script>
		
		<script>
			function showCalendar()
			{
				var date = new YAHOO.widget.Calendar("edateid");
				date.render();
			}

			function getSelectedDate()
			{
				var arrDates = cal1.getSelectedDates();
				for (var i = 0; i < arrDates.length; ++i) {
					var date = arrDates[i];

					var displayMonth = date.getMonth() + 1;
					var displayYear = date.getFullYear();
					var displayDate = date.getDate();
				}
			}
		</script>
	</head>
	<body bgcolor="#D1D1D1" class="yui-skin-sam">
		<h1>Event Post</h1>
		<form action="EventData.php" method="get">
			<table>
				<tr>
					<td><label for="firstid">First Name </label></td>
					<td><input type="text" id="firstid" name="first" maxlength="20"/></td>
				</tr>
				<tr>
					<td><label for="lastid">Last Name </label></td>
					<td><input type="text" id="lastid" name="last" maxlength="20"/></td>
				</tr>
				<tr>
					<td><label for="emailid">Email </label></td>
					<td><input type="text" id="emailid" name="email" maxlength="20"/></td>
				</tr>
				<tr>
					<td><label for="phoneid">Phone </label></td>
					<td><input type="text" id="phoneid" name="phone" maxlength="20"/></td>
				</tr>
				<tr>
					<td><label for="enameid">Event Name </label></td>
					<td><input type="text" id="enameid" name="ename" maxlength="20"/></td>
				</tr>
				<tr>
					<td class="label">Event RSVP </td> 
					<td>
						<input type="radio" name="ersvp" value="yes"/>Yes
						<input type="radio" name="ersvp" value="no"/>No
					</td>
				</tr>
				<tr>
					<td class="label">Event Type </td> 
					<td>
						<select name="etype">
							<option selected="selected">Select</option>
							<option value="sport">Sport</option>
							<option value="social">Social</option>
							<option value="school">School</option>
							<option value="organization">Organization</option>
							<option value="career">Career</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="edateid">Event Date </label></td>
					<td><div id="edateid"></div>
					<script>
						showCalendar();
					</script>
					</td>
				</tr>
				<tr>
					<td><label for="elocationid">Event Location </label></td>
					<td><textarea id="elocationid" name="elocation" rows="2" cols="60"></textarea></td>
				</tr>
				<tr>
					<td><label for="edescriptionid">Event Description </label></td>
					<td><textarea id="edescriptionid" name="elocation" rows="10" cols="60"></textarea></td>
				</tr>
				<tr>
					<td colspan="2" align="right">
						<input type="submit" name="cancel" value="Cancel"/>
						<input type="reset" name="reset" value="Clear"/>
						<input type="submit" name="submit" value="Submit"/>
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>

