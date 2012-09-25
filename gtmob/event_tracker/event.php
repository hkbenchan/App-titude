<?php

include 'db_helper.php';

function groupByStartDate($input_array = null) {

	if (isset($input_array) && is_array($input_array) && count($input_array)) {
		$result = array();
        /* group by date */
        $previous_date = new DateTime();
		
		//We get rid of the time, and just keep the date part.
		$previous_date->setTime(0, 0, 0);
		
        foreach ($input_array as $val) {
        	$current_date = new DateTime($val['StartTime']);
        	$current_date->setTime(0,0,0);
        	if ($current_date == $previous_date) {
        		$result[date_format($previous_date, 'Y-m-d')][] = $val;
        	} else {
        		$previous_date = $current_date;
        		$result[date_format($current_date, 'Y-m-d')][] = $val;
        	}
        }
        /* end of group by date */
		return $result;
	} else return null;
	
}


function listEvents($limit = null, $offset = null) {

        $dbQuery = sprintf("SELECT ID,Title, StartTime FROM Event
        WHERE StartTime >= CURRENT_TIMESTAMP
        ORDER BY StartTime ASC");
        
        if (is_numeric($limit) && is_numeric($offset)) {
        	$dbQuery += sprintf("LIMIT '%s', '%s'",mysql_real_escape_string($offset),
        	mysql_real_escape_string($limit));
        }
        
        $tmp = getDBResultsArray($dbQuery);
        $result = groupByStartDate($tmp);
        
        header("Content-type: application/json");
        echo json_encode($result);
}
 
function getEvent($id) {
	if (!is_numeric($id)) { $id = 0; }

	$dbQuery = sprintf("SELECT `Event`.*, `Creator`.*, `Location`.*, `EventType`.* FROM `Event`
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
