<?php

if(isset($_POST['submit'])){

$name = $_POST['name'];
$email = $_POST['email'];
$country = $_POST['country'];
$phone = $_POST['phone'];
$age = $_POST['age'];
$sex = $_POST['sex'];
$disease = $_POST['disease'];
$treatment = $_POST['treatment'];
$description = $_POST['description'];
$destination = $_POST['destination'];
$secondopinion = $_POST['secondopinion'];
$formcontent=" From: $name \n Email: $email \n Country: $country \n Phone: $phone \n Age: $age \n Sex: $sex \n Disease: $disease \n Treatment: $treatment \n Description: $description \n Destination: $destination \n Secondopinion: $secondopinion";
$recipient = "rajpandiyen@gmail.com, medobalweb@gmail.com";
$subject = "Medobal Enquiry";
$mailheader = "From: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
//echo "Thank You for your enquiry!" . " -" . "<a href='index.html' style='text-decoration:none;color:#ff0099;'> CLICK HERE to continue</a>";
}

?>
