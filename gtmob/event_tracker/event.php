<?php

include 'db_helper.php';

function s_echo($str) {
	$debug = true;
	if ($debug) print_r($str,true);
}

/**
* A helper function that checks the correctness of data
*/
function preprocessDataCheck($search_str, $error_msg) {
	if (!(array_key_exists($search_str,$_POST) && (!is_null($_POST[$search_str])) && ($_POST[$search_str] != "")))
	{
		$GLOBALS["_PLATFORM"]->sandboxHeader("HTTP/1.1 500 Internal Server Error");
		header("Content-type: application/json");
        echo json_encode(array('error_msg'=> $error_msg));
		die();
	}
}

/**
* A helper function that group the events by date
*/
function groupByStartDate($input_array = null) {

	if (isset($input_array) && is_array($input_array) && count($input_array)) {
		$result = array();
        /* group by date */
        $previous_date = new DateTime('yesterday');
		
		//We get rid of the time, and just keep the date part.
		$previous_date->setTime(0, 0, 0);
		$i = -1;
        foreach ($input_array as $val) {
        	$current_date = new DateTime($val['StartTime']);
        	$current_date->setTime(0,0,0);
        	if ($current_date == $previous_date) {
        		$result[$i][] = $val;
        	} else {
				$result['date'][] = date_format($current_date, 'Y-m-d');
        		$previous_date = $current_date;
				$i++;
        		$result[$i][] = $val;
        	}
        }
        /* end of group by date */
		return $result;
	} else return null;
	
}

/** 
* If $limit and $offset are both set, then this is a pagination call;
* Otherwise, it will list out all join-able events
*/
function listEvents($limit = null, $offset = null) {

		if (is_numeric($limit) && is_numeric($offset)) {
        	$dbQuery = sprintf("SELECT ID,Title, StartTime FROM Event
        	WHERE StartTime >= CURRENT_TIMESTAMP
        	ORDER BY StartTime ASC
        	LIMIT %s, %s",mysql_real_escape_string($offset),mysql_real_escape_string($limit));
        } else {
			$dbQuery = sprintf("SELECT ID,Title, StartTime FROM Event
			WHERE StartTime >= CURRENT_TIMESTAMP
			ORDER BY StartTime ASC");			
        }
        $tmp = getDBResultsArray($dbQuery);
        $result = groupByStartDate($tmp);
        
        header("Content-type: application/json");
        echo json_encode($result);
}
 
function getEvent($id) {
	if (!is_numeric($id)) { $id = 0; }

	$dbQuery = sprintf("SELECT `Event`.ID AS `Event_ID`, `Creator`.ID AS `Creator_ID`,
	`Location`.ID AS `Location_ID`, `EventType`.ID AS `EventType_ID`,
	`Event`.*, `Creator`.*, `Location`.*, `EventType`.* FROM `Event`
	JOIN `Creator` ON `Event`.CreatorID = `Creator`.ID
	JOIN `Location`ON `Event`.LocationID = `Location`.ID
	JOIN `EventType` ON `Event`.EventTypeID = `EventType`.ID
	WHERE `Event`.ID = '%s'", mysql_real_escape_string($id));

	$result=getDBResultRecord($dbQuery);
	//echo '<pre>'.print_r($result).'</pre>';
        header("Content-type: application/json");
        echo json_encode($result);
}
 
function postEvent($event = null) {
		
		/**
		* insert split into 5 parts
		* (1) Creator Table
		* (2) CreatorOwn Table
		* (3) Location Table
		* (4) EventType Table
		* (5) Event Table
		*/
		
		/**
		* Flow:
		* Check if the user has the right to post event (Query if the username exist on AuthUser)
		* If true, then proceed; else die()
		* Get event contact (email, phone, additional contact)
		* (1) Insert to the Creator table, get back the CreatorID
		* (2) Use the CreatorID and account name to insert to CreatorOwn Table
		* (3) Get the LatCoord, LongCoord, Name and insert to Location, get back the LocationID
		* Get the EventTypeDesc and search if it exists in the table
		* If true, use that EventTypeID; else (4) insert into EventType Table and get back the EventTypeID
		* (5) Use all data that needed to insert to Event table, get back the EventID and return
		*/
		
		/*
		* Data needed:
		* OrganizationName
		* Email, Phone, Contact
		* LatCoord, LongCoord, Location
		* EventTypeDesc
		* Title, Description, StartTime, EndTime
		*/
		
		s_echo($_REST);
		s_echo($_POST);
		s_echo($_GET);
		die();
		
		
		// check the permission
		global $_USER;
		$acctName = $_USER['uid'];
		
		// pre-check OrganizationName before do permission check
		
		preprocessDataCheck("OrganizationName","Organization Name cannot be empty");
				
		s_echo("Just started");
		$dbQuery = sprintf("SELECT `AuthUser`.*, o.OrganizationName FROM `AuthUser`
		JOIN `Organization` o ON `AuthUser`.OnBehalf = o.ID
		WHERE `AuthUser`.AcctName = '%s' AND o.OrganizationName = '%s'",
		mysql_real_escape_string($acctName), mysql_real_escape_string($_POST['OrganizationName']));
		
		s_echo("Permission SQL: " . $dbQuery);
		
		$permission = getDBResultRecord($dbQuery); // the server will terminate if no permission
		
		s_echo("You have the permission.");
		
		// do all the necessary checking in here
		// fields that cannot empty: Location, Title, StartTime, EndTime, EventTypeDesc
		
		preprocessDataCheck("Location","Location cannot be empty");
		preprocessDataCheck("Title","Title cannot be empty");
		preprocessDataCheck("StartTime","Start Time cannot be empty");
		preprocessDataCheck("EndTime","End Time cannot be empty");
		preprocessDataCheck("EventTypeDesc","Event Type Name cannot be empty");
		
		// StartTime <= EndTime
		$date_s = strtotime($_POST['StartTime']);
		$date_e = strtotime($_POST['EndTime']);
		if ($date_s > $date_e)
		{
			$GLOBALS["_PLATFORM"]->sandboxHeader("HTTP/1.1 500 Internal Server Error");
			header("Content-type: application/json");
	        echo json_encode(array('error_msg'=> "Start Time should be earlier than End Time"));
			die();
		}
		
		// Insert to the Creator Table
		$dbQuery = sprintf("INSERT INTO Creator (Email_address,Phone_number,Contact) VALUES ('%s','%s','%s')",
					mysql_real_escape_string($_POST[ 'Email' ]),mysql_real_escape_string($_POST[ 'Phone' ]),
					mysql_real_escape_string($_POST[ 'Contact' ]));
		
		s_echo("Creator SQL: ".$dbQuery);
		
		$result = getDBResultInserted($dbQuery,'ID'); // get back the CreatorID
		
		s_echo("Creator Table inserted");
		
		$CreatorID = $result['ID'];
		
		s_echo("CreatorID: ".$CreatorID);
		
		// Insert to the CreatorOwn Table
		$dbQuery = sprintf("INSERT INTO CreatorOwn (CreatorID,AuthUserID) VALUES ('%s','%s')",
					mysql_real_escape_string($CreatorID),mysql_real_escape_string($permission['ID']));
		
		s_echo("CreatorOwn SQL: ".$dbQuery);
		
		getDBResultInserted($dbQuery,'dummyID');
		
		s_echo("CreatorOwn Table inserted");
		
		// Search if Location has the same record
		$LocationCall = 0; // Avoid checking again if we need to insert it later
		if ((is_float($_POST['LatCoord']) || is_numeric($_POST['LatCoord'])) && 
		(is_float($_POST['LongCoord']) || is_numeric($_POST['LongCoord'])) && 
		(!is_null($_POST['Location']))) {
			$dbQuery = sprintf("SELECT ID FROM Location WHERE Location.Name = '%s' AND
			Location.LatCoord = '%s' AND Location.LongCoord = '%s'",
			mysql_real_escape_string($_POST['Location']),
			mysql_real_escape_string($_POST['LatCoord']),
			mysql_real_escape_string($_POST['LongCoord']));
			$LocationCall = 1;
		} elseif ((is_float($_POST['LatCoord']) || is_numeric($_POST['LatCoord'])) && 
		(is_float($_POST['LongCoord']) || is_numeric($_POST['LongCoord']))) {
			$dbQuery = sprintf("SELECT ID FROM Location WHERE Location.Name is null AND
			Location.LatCoord = '%s' AND Location.LongCoord = '%s'",
			mysql_real_escape_string($_POST['LatCoord']),
			mysql_real_escape_string($_POST['LongCoord']));
			$LocationCall = 2;
		} elseif (!is_null($_POST['Location'])) {
			$dbQuery = sprintf("SELECT ID FROM Location WHERE Location.Name = '%s' AND
			Location.LatCoord is null AND Location.LongCoord is null",
			mysql_real_escape_string($_POST['Location']));
			$LocationCall = 3;
		}
		
		s_echo("Location search SQL: ".$dbQuery);
		
		$result = getDBResultNoHarm($dbQuery);
		
		s_echo("Location result: ".count($result));
		
		if (count($result) > 1) {
			$LocationID = $result[0]['ID'];
		} elseif (count($result) == 1) {
			$LocationID = $result['ID'];
		} else {
			// need to insert to the Location Table
			switch ($LocationCall){
				case 1: $dbQuery = sprintf("INSERT INTO Location(LatCoord,LongCoord,Name)
				VALUES ('%s','%s','%s')",mysql_real_escape_string($_POST['LatCoord']),
				mysql_real_escape_string($_POST['LongCoord']),
				mysql_real_escape_string($_POST['Name'])); break;
				
				case 2: $dbQuery = sprintf("INSERT INTO Location(LatCoord,LongCoord,Name)
				VALUES ('%s','%s',NULL)",mysql_real_escape_string($_POST['LatCoord']),
				mysql_real_escape_string($_POST['LongCoord'])); break;
				
				case 3: $dbQuery = sprintf("INSERT INTO Location(LatCoord,LongCoord,Name)
				VALUES (NULL,NULL,'%s')",mysql_real_escape_string($_POST['Name'])); break;
				
				case 4: $dbQuery = sprintf("INSERT INTO Location(LatCoord,LongCoord,Name)
				VALUES (NULL,NULL,NULL)"); break;
			}
			
			s_echo("Location insert SQL: ".$dbQuery);
			
			$result = getDBResultInserted($dbQuery,'ID');
			
			s_echo("Location insert SQL complete");
			
			$LocationID = $result['ID'];

		}
		
		s_echo("Location ID: ". $LocationID);
		
		// EventType
		
		// Need to Search if that EventType exists
		if (is_null($_POST['EventTypeDesc']))
			$dbQuery = sprintf("SELECT ID FROM EventType 
			WHERE EventType.EventTypeDesc is null");
		else $dbQuery = sprintf("SELECT ID FROM EventType
			WHERE EventType.EventTypeDesc = '%s'",
			mysql_real_escape_string($_POST['EventTypeDesc']));
		
		s_echo("EventType search SQL: ".$dbQuery);
		
		$result = getDBResultNoHarm($dbQuery);
		
		s_echo("EventType result: ".count($result));
		
		if (count($result) > 1) {
			// something wrong with the DB, but we will just pick up the first entry
			$EventTypeID = $result[0]['ID'];
		} elseif (count($result) == 1) {
			$EventTypeID = $result['ID'];
		} else {
			// need to insert to the EventType Table
			if (is_null($_POST['EventTypeDesc'])) {
				$dbQuery = sprintf("INSERT INTO EventType(EventTypeDesc) VALUES (null)");
			} else {
				$dbQuery = sprintf("INSERT INTO EventType(EventTypeDesc) VALUES ('%s')",
				mysql_real_escape_string($_POST['EventTypeDesc']));
			}
			
			s_echo("EventType insert SQL: ".$dbQuery);
			
			$result = getDBResultInserted($dbQuery,'ID');
			
			s_echo("EventType insert success");
			
			$EventTypeID = $result['ID'];
		}
		
		s_echo("EventType ID: ".$EventTypeID);
		
		// Finally, we can insert to the Event Table
		// Parameters: Title, Description, StartTime, EndTime, LocationID, CreatorID, EventTypeID
		if (is_null($_POST['Description'])) {
			$dbQuery = sprintf("INSERT INTO Event(Title, StartTime, EndTime, LocationID,
			CreatorID, EventTypeID) VALUES ('%s','%s','%s','%s','%s','%s')",
			mysql_real_escape_string($_POST['Title']),
			mysql_real_escape_string($_POST['StartTime']),
			mysql_real_escape_string($_POST['EndTime']),
			mysql_real_escape_string($LocationID),
			mysql_real_escape_string($CreatorID),
			mysql_real_escape_string($EventTypeID));

		} else {

			$dbQuery = sprintf("INSERT INTO Event(Title, Description, StartTime, EndTime, 
			LocationID, CreatorID, EventTypeID) 
			VALUES ('%s','%s','%s','%s','%s','%s','%s')",
			mysql_real_escape_string($_POST['Title']),
			mysql_real_escape_string($_POST['Description']),
			mysql_real_escape_string($_POST['StartTime']),
			mysql_real_escape_string($_POST['EndTime']),
			mysql_real_escape_string($LocationID),
			mysql_real_escape_string($CreatorID),
			mysql_real_escape_string($EventTypeID));

		}
		
		s_echo("Finally, Event SQL: ".$dbQuery);
		
        $result = getDBResultInserted($dbQuery,'EventID');
        
        s_echo("Event insert success");
        header("Content-type: application/json");
        echo json_encode($result);
}
 
function updateEvent($id,$event) {
        /*$dbQuery = sprintf("UPDATE comments SET comment = '%s' WHERE id = '%s'",
                mysql_real_escape_string($comment),
                mysql_real_escape_string($id));
        
        $result = getDBResultAffected($dbQuery);
        
        header("Content-type: application/json");
        echo json_encode($result);*/
}
 
function deleteEvent($id) {
	if (!is_numeric($id)) { $id = 0; }
        $dbQuery = sprintf("DELETE FROM Event WHERE id = '%s' AND StartTime >= CURRENT_TIMESTAMP",
                mysql_real_escape_string($id));                                                                                         
        $result = getDBResultAffected($dbQuery);
        header("Content-type: application/json");
        echo json_encode($result);
}


/*********************************************
** event/type
**********************************************/

function listEventType() {
	$dbQuery = sprintf("select * from EventType WHERE ID in
				(select distinct(EventTypeID) from Event)");
	$result = getDBResultArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function getEventsByType($EventTypeID) {
	$dbQuery = sprintf("SELECT `Event`.ID AS `Event_ID`, `Creator`.ID AS `Creator_ID`,
	`Location`.ID AS `Location_ID`, `EventType`.ID AS `EventType_ID`,
	`Event`.*, `Creator`.*, `Location`.*, `EventType`.* FROM `Event`
	JOIN `Creator` ON `Event`.CreatorID = `Creator`.ID
	JOIN `Location`ON `Event`.LocationID = `Location`.ID
	JOIN `EventType` ON `Event`.EventTypeID = `EventType`.ID
	WHERE `EventType`.ID = '%s'", mysql_real_escape_string($EventTypeID));
}

?>
