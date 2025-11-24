package cz.burios.qpx.darwin.controller;

import java.io.File;
import java.io.FileInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import cz.burios.qpx.darwin.db.dao.FileStoreDao;
import cz.burios.qpx.darwin.model.FileRecord;
import cz.burios.qpx.darwin.web.file.FileDownloader;
import cz.burios.qpx.darwin.web.file.FileUploader;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/files")
public class FileController {

	private final String uploadDir = "D:/DATA/repo/darwin";
	private final FileUploader uploader = new FileUploader(uploadDir);
	private final FileDownloader downloader = new FileDownloader(uploadDir);

	@PostMapping("/upload")
	public String handleFileUpload(@RequestParam("file") MultipartFile file, Model model) {
		try {
			// ModelAndView
			String id = uploader.uploadFile(file);
			model.addAttribute("message", "Soubor nahrán s ID: " + id);
			return "upload";
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při uploadu: " + e.getMessage());
			return "upload";
		}
	}

	@PostMapping("/ajax/upload")
	@ResponseBody
	public FileRecord handleAjaxUpload(@RequestParam("file") MultipartFile file) throws Exception {
		String id = uploader.uploadFile(file);
		FileStoreDao dao = new FileStoreDao();
		return dao.findById(id);
	}

	@GetMapping(value = "/download", params = "fileId")
	public void downloadFile(@RequestParam("fileId") String fileId, HttpServletResponse response) {
		System.out.println("FileController.downloadFile(" + fileId + ")");
		try {
			FileStoreDao dao = new FileStoreDao();
			String fileName = dao.getFileNameById(fileId);

			if (fileName == null) {
				response.sendError(HttpServletResponse.SC_NOT_FOUND, "Soubor s ID " + fileId + " nenalezen");
				return;
			}
			downloader.downloadFileByName(fileName, response);
		} catch (Exception e) {
			throw new RuntimeException("Chyba při stahování souboru", e);
		}
	}

	@GetMapping(value = "/files/ajax/download", params = "fileId")
	public ResponseEntity<Resource> downloadFileAjax(@PathVariable String fileId) throws Exception {
		FileStoreDao dao = new FileStoreDao();
		String fileName = dao.getFileNameById(fileId);
		if (fileName == null) {
			return ResponseEntity.notFound().build();
		}
		File file = new File(uploadDir, fileName);
		InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.contentLength(file.length()).contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
	}

}