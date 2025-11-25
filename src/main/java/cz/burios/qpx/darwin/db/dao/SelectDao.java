package cz.burios.qpx.darwin.db.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import cz.burios.qpx.darwin.db.DBContext;

public class SelectDao {
	
	private String tableName;
	private String whereClause;
	private List<Object> whereParams = new ArrayList<>();
	private String orderByClause;
	private String groupByClause;
	private Integer limitValue;
	private Integer offsetValue;

	public SelectDao select(String tableName) {
		this.tableName = tableName;
		return this;
	}

	public SelectDao where(String condition, Object... params) {
		this.whereClause = condition;
		this.whereParams.clear();
		if (params != null) {
			for (Object p : params) {
				this.whereParams.add(p);
			}
		}
		return this;
	}

	public SelectDao orderBy(String column, String direction) {
		this.orderByClause = column + " " + direction;
		return this;
	}

	public SelectDao groupBy(String column) {
		this.groupByClause = column;
		return this;
	}

	public SelectDao limit(int n) {
		this.limitValue = n;
		return this;
	}

	public SelectDao offset(int n) {
		this.offsetValue = n;
		return this;
	}

	public List<BasicRecord> execute() throws Exception {
		StringBuilder sql = new StringBuilder("SELECT * FROM ").append(tableName);

		if (whereClause != null)
			sql.append(" WHERE ").append(whereClause);
		if (groupByClause != null)
			sql.append(" GROUP BY ").append(groupByClause);
		if (orderByClause != null)
			sql.append(" ORDER BY ").append(orderByClause);
		if (limitValue != null)
			sql.append(" LIMIT ").append(limitValue);
		if (offsetValue != null)
			sql.append(" OFFSET ").append(offsetValue);

		List<BasicRecord> list = new ArrayList<>();
		try (Connection conn = DBContext.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql.toString())) {
			for (int i = 0; i < whereParams.size(); i++) {
				ps.setObject(i + 1, whereParams.get(i));
			}
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					list.add(mapRow(rs));
				}
			}
		}
		return list;
	}

	private BasicRecord mapRow(ResultSet rs) throws SQLException {
		BasicRecord record = new BasicRecord();
		int cols = rs.getMetaData().getColumnCount();
		for (int i = 1; i <= cols; i++) {
			String colName = rs.getMetaData().getColumnLabel(i);
			Object value = rs.getObject(i);
			record.put(colName, value);
		}
		return record;
	}
}