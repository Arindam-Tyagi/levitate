import mysql from 'mysql2/promise';
import pg from 'pg';
import { MongoClient } from 'mongodb';

export const fetchDataFromDB = async (config) => {
  const { dbType, host, port, user, password, database, table } = config;
  const limit = 100;

  switch (dbType) {
    case 'mysql': {
      const conn = await mysql.createConnection({ host, port: port || 3306, user, password, database });
      const [rows] = await conn.execute(`SELECT * FROM \`${table}\` LIMIT ${limit}`);
      await conn.end();
      if (!rows.length) throw new Error('Table is empty.');
      return { headers: Object.keys(rows[0]), data: rows };
    }
    case 'postgresql': {
      const client = new pg.Client({ host, port: port || 5432, user, password, database });
      await client.connect();
      const res = await client.query(`SELECT * FROM "${table}" LIMIT ${limit}`);
      await client.end();
      if (!res.rows.length) throw new Error('Table is empty.');
      return { headers: Object.keys(res.rows[0]), data: res.rows };
    }
    case 'mongodb': {
      const uri = `mongodb://${user}:${password}@${host}:${port || 27017}/${database}?authSource=admin`;
      const client = new MongoClient(uri);
      await client.connect();
      const data = await client.db(database).collection(table).find({}).limit(limit).toArray();
      await client.close();
      if (!data.length) throw new Error('Collection is empty.');
      const headers = [...new Set(data.flatMap(doc => Object.keys(doc)))];
      const sanitized = data.map(doc => ({ ...doc, _id: doc._id.toString() }));
      return { headers, data: sanitized };
    }
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
};