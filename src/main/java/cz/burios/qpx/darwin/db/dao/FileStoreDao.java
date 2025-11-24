package cz.burios.qpx.darwin.db.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cz.burios.qpx.darwin.db.DBContext;
import cz.burios.qpx.darwin.model.FileRecord;
import cz.burios.qpx.util.IdGenerator;

public class FileStoreDao {

	public String saveFile(String fileName) throws Exception {
		String id = IdGenerator.generateId();

		try (Connection conn = DBContext.getDataSource().getConnection();
				PreparedStatement ps = conn.prepareStatement("INSERT INTO file_store (id, file_name) VALUES (?, ?)")) {

			ps.setString(1, id);
			ps.setString(2, fileName);
			ps.executeUpdate();
		}
		return id;
	}

	// načte název souboru podle ID
	public String getFileNameById(String id) throws Exception {
		try (Connection conn = DBContext.getDataSource().getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT file_name FROM file_store WHERE id = ?")) {

			ps.setString(1, id);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getString("file_name");
				}
			}
		}
		return null;
	}

	public List<FileRecord> findAll() throws Exception {
		List<FileRecord> list = new ArrayList<>();
		try (Connection conn = DBContext.getDataSource().getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT id, file_name FROM file_store");
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {
				FileRecord record = new FileRecord(rs.getString("id"), rs.getString("file_name"));
				list.add(record);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	public FileRecord findById(String id) throws Exception {
		try (Connection conn = DBContext.getDataSource().getConnection();
			 PreparedStatement ps = conn.prepareStatement("SELECT id, file_name FROM file_store WHERE id=?")) {
			ps.setString(1, id);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return new FileRecord(rs.getString("id"), rs.getString("file_name"));
				}
			}
		}
		return null;
	}
}