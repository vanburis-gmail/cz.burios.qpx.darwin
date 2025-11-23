<%@ page contentType="text/html;charset=UTF-8"%>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Buriosca.cz - Darwin QPX</title>

<link rel="icon" href="/devel/favicon.png">
<link rel="stylesheet" href="/buquet/libs/jqx/jqx.css" rel="stylesheet"
	type="text/css">

<style type="text/css">
html, body {
	font-family: Segoe UI;
	font-size: 12px;
}
</style>

<script type="text/javascript" src="/buquet/libs/jquery/jquery-3.4.1.js"></script>

<script>
	
</script>
</head>
<body>
	<h2>Buriosca.cz - Darwin QPX - Upload</h2>
	<form method="post" enctype="multipart/form-data"
		action="${pageContext.request.contextPath}/files/uploading">
		<input type="file" name="file" />
		<button type="submit">Upload</button>
	</form>
</body>
</html>