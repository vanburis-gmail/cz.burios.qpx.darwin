package cz.burios.qpx.darwin.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import cz.burios.qpx.darwin.db.dao.FileStoreDao;
import cz.burios.qpx.darwin.model.FileRecord;
import cz.burios.qpx.darwin.web.file.FileDownloader;
import cz.burios.qpx.darwin.web.file.FileUploader;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/files")
public class FileController {

	private final FileUploader uploader = new FileUploader("D:/DATA/repo/darwin");
	private final FileDownloader downloader = new FileDownloader("D:/DATA/repo/darwin");

	@GetMapping("/upload")
	public String showUploadForm(Model model) {
		try {
			FileStoreDao dao = new FileStoreDao();
			List<FileRecord> files = dao.findAll(); // nová metoda v DAO
			model.addAttribute("files", files);
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při načítání seznamu souborů: " + e.getMessage());
		}
		return "upload";
	}

	@PostMapping("/uploading")
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

	@GetMapping("/download")
	public String showDownloadForm(Model model) {
		try {
			FileStoreDao dao = new FileStoreDao();
			List<FileRecord> files = dao.findAll();
			System.out.println("FileController.showDownloadForm().files: " + files);
			model.addAttribute("files", files);
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při načítání seznamu souborů: " + e.getMessage());
		}
		return "download";
	}
	/*
	@GetMapping("/downloading")
	public void download(@RequestParam("fileId") String id, HttpServletResponse response) {
		System.out.println("FileController.downloadFile(" + id + ")");
		try {
			FileStoreDao dao = new FileStoreDao();
			String fileName = dao.getFileNameById(id);
			if (fileName == null) {
				response.sendError(HttpServletResponse.SC_NOT_FOUND, "Soubor s ID " + id + " nenalezen");
				return;
			}
			downloader.downloadFileByName(fileName, response);
		} catch (Exception e) {
			throw new RuntimeException("Chyba při stahování souboru", e);
		}
	}
	*/
	@GetMapping(value = "/downloading", params = "fileId")
	public void downloadFile(@RequestParam("fileId") String fileId, HttpServletResponse response) {
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
}