package cz.burios.qpx.darwin.db.dao;

public class BasicDaoFactory {

    public static SelectDao select(Object... columns) {
        return new SelectDao().select(columns);
    }

    public static InsertDao insert(String tableName) {
        return new InsertDao().insert(tableName);
    }

    public static UpdateDao update(String tableName) {
        return new UpdateDao().update(tableName);
    }

    public static DeleteDao delete(String tableName) {
        return new DeleteDao().delete(tableName);
    }
}