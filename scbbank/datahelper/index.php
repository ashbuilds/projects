<?php

$apiKey = "AIzaSyBzvFXsv7AfqowiE_cM1PXaT6_o4tz9eZM";

if(isset($_POST['data'])){
$data = json_decode($_POST['data']);
$location = $data->location;//"13.7563,100.5018";
$language = $data->lang;//"en";
$pagetoken = $data->pagetoken;
$url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Siam+Commercial|scb&location=".$location."&hasNextPage=true&nextPage()=true&pagetoken=".$pagetoken."&radius=10000&key=".$apiKey;
$json = file_get_contents($url);
$json = json_decode($json);
if(isset($json->next_page_token)){
$pagetoken = $json->next_page_token;
sleep(3);
$url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Siam+Commercial|scb&location=".$location."&hasNextPage=true&nextPage()=true&pagetoken=".$pagetoken."&radius=10000&key=".$apiKey;
$jsonNew = file_get_contents($url);
$jsonNew = json_decode($jsonNew);
$result = array_merge($json->results, $jsonNew->results);
$jsonNew->results=$result;
echo json_encode($jsonNew);
}
else{
echo json_encode($json);
}
}
?>
