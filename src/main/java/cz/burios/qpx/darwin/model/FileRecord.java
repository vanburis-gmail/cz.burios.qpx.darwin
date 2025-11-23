package cz.burios.qpx.darwin.model;

public class FileRecord {
	
	private String id;
	private String fileName;

	public FileRecord(String id, String fileName) {
		this.id = id;
		this.fileName = fileName;
	}

	public String getId() {
		return id;
	}

	public String getFileName() {
		return fileName;
	}
}
