package cz.burios.qpx.darwin.listener;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import cz.burios.qpx.darwin.db.DBContext;

public class DBInitListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		try {
			InitialContext ic = new InitialContext();
			DataSource ds = (DataSource) ic.lookup("java:comp/env/jdbc/JPADataSource");
			System.out.println("DBInitListener.contextInitialized().ds: " + ds);
			DBContext.setDataSource(ds);
			System.out.println("DBContext initialized with DataSource");
		} catch (Exception e) {
			throw new RuntimeException("Failed to initialize DBContext", e);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		DBContext.setDataSource(null);
	}
}