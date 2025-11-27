<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core" %>

<html lang="cs">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	
		<title>Buriosca.cz - Darwin QPX</title>

		<link rel="icon" href="/darwin/favicon.png">
		<link rel="stylesheet" href="/darwin/libs/qpx/qpx-default.css" rel="stylesheet" type="text/css">

		<style type="text/css">
		html, body {
			font-family: Segoe UI;
			font-size: 12px;
		}
		</style>

		<script type="text/javascript" src="/darwin/libs/jquery/jquery-3.7.1.js"></script>
		<script type="text/javascript" src="/darwin/libs/qpx/jquery.qpx.js"></script>
		<script type="text/javascript" src="/darwin/libs/qpx/qpToolBar.js"></script>
		
		<script></script>
	</head>
	<body style="height: 100vh; position: relative;">
		
		<div id="myToolbar" class="qp-toolbar" style="width: 100vw"></div>
		<%--
		<h2>Buriosca.cz - Darwin QPX</h2>
		 --%>
		
		<script>
		$("#myToolbar").qpToolBar({
			  sections: {
			    left: [
			      { tag: "button", text: "Home" },
			      { tag: "button", text: "Back" }
			    ],
			    center: [
			      { tag: "span", text: "Dashboard Dashboard Dashboard Dashboard Dashboard ", class: "title" }
			    ],
			    right: [
			      { tag: "button", text: "Settings" },
			      { tag: "button", text: "Help" },
			      { tag: "button", text: "Profile" }
			    ],
			    sidebar: [
			      { tag: "button", text: "Extra Option" }
			    ]
			  }
			});

		</script>
	</body>
</html>