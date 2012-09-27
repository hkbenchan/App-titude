<?php

include 'db_helper.php';

global $_USER; // in case we need to user acct name => access by $_USER['uid']

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
 
function postEvent($event) {
		
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
		
		// check the permission
		
		$acctName = $_USER['uid'];
		$dbQuery = sprintf("SELECT * FROM AuthUser WHERE AcctName = '%s'",mysql_real_escape_string($acctName));
		$permission = getDBResultArray($dbQuery); // the server will terminate if no permission
		
		$dbQuery = sprintf("INSERT INTO Creator (Email_address,Phone_number,Contact) VALUES ('%s','%s','%s')",
					mysql_real_escape_string($_POST[ 'Email' ]),mysql_real_escape_string($_POST[ 'Phone' ]),
					mysql_real_escape_string($_POST[ 'Contact' ]));
		
		$result = getDBResultInserted($dbQuery,'ID');
		
        /*$dbQuery = sprintf("INSERT INTO comments (comment) VALUES ('%s')",
                mysql_real_escape_string($comment));
 
        $result = getDBResultInserted($dbQuery,'personId');
        
        header("Content-type: application/json");
        echo json_encode($result);*/
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

?>
