package cz.burios.qpx.darwin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {
	
	@GetMapping("/download")
	public String showDownloadForm() {
		return "download";
	}

	@GetMapping("/upload")
	public String showUploadForm() {
		return "upload";
	}	
}