export class DatabaseUtils {
  public static addValidity() {
    return `[${new Date().toISOString()},)`;
  }
}
