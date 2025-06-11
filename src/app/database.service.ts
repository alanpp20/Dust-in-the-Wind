import { Injectable, signal, WritableSignal } from '@angular/core';

import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_USERS = "myuserdb";

export interface User {
  token: string,
  name: string,
  email: string,
  master:boolean
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private user: WritableSignal<User[]> = signal<User[]>([]);
  constructor() { }

  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS users (
    token VARCHAR(45) PRIMARY KEY NOT NULL,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL,
    master TINYINT    
  );`;

  await this.db.execute(schema);
  this.loadUsers();
  return true;
  };

  //CRUD operations
  async loadUsers() {
    const result = await this.db.query('SELECT * FROM users');
    this.user.set(result.values || []);
  }
  async addUser(user: User) {
    //truncate if user is not empty
    if(this.loadUsers.length > 0) {
      await this.truncateUsers();
    }
    const result = await this.db.run('INSERT INTO users (token, name, email, master) VALUES (?, ?, ?, ?)', [user.token, user.name, user.email, user.master ? 1 : 0]);
    
    return result;
  }
  async deleteUser(token: string) {
    const result = await this.db.run('DELETE FROM users WHERE token = ?', [token]);
    return result;
  }
  //truncate table
  async truncateUsers() {
    const result = await this.db.run('DELETE FROM users');
    this.user.set([]);
    return result;
  }

  getUsers(): WritableSignal<User[]> {
    return this.user;
  }

}
