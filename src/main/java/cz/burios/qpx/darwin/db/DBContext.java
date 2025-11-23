package cz.burios.qpx.darwin.db;

import javax.sql.DataSource;

public class DBContext {

	private static DataSource dataSource;

	public static void setDataSource(DataSource ds) {
		dataSource = ds;
	}

	public static DataSource getDataSource() {
		return dataSource;
	}
}