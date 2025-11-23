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
	<h2>Buriosca.cz - Darwin QPX - Download</h2>
	<form method="get" action="/darwin/files/downloadjng">
		<label for="fileId">Vyber soubor:</label>
		<select name="fileId" id="fileId">
			<c:forEach var="file" items="${files}">
				<option value="${file.id}">${file.fileName}</option>
			</c:forEach>
		</select>
		<button type="submit">Download</button>
	</form>

	<c:if test="${not empty error}">
		<p style="color:red">${error}</p>
	</c:if>
</body>
</html>