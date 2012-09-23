<?php

include 'db_helper.php';
 
function listEvents() {
        $dbQuery = sprintf("SELECT ID,Title FROM Event");
        $result = getDBResultsArray($dbQuery);
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
        /*$dbQuery = sprintf("DELETE FROM comments WHERE id = '%s'",
                mysql_real_escape_string($id));                                                                                         
        $result = getDBResultAffected($dbQuery);
        
        header("Content-type: application/json");
        echo json_encode($result);*/
}

?>
