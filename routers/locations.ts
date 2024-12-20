import express from 'express';
import mysqlDb from '../mysqlDb';
import { Location, LocationBody } from '../types';
import { ResultSetHeader } from 'mysql2/promise';

const router = express.Router();

router.get('/', async (req, res) => {
  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT id, name FROM locations');
  const data = result as Location[];

  res.send(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);
  const data = result as Location[];

  if (data.length === 0) {
    res.status(404).send('Location not found.');
  } else {
    res.send(data[0]);
  }
});

router.post('/', async (req, res) => {
  if (!req.body.name) {
    res.status(400).send('Name is required.');
    return;
  }

  const body: LocationBody = {
    name: req.body.name,
    description: req.body.description ?? null,
  };

  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('INSERT INTO locations (name, description) VALUES (?, ?)', [body.name, body.description]);
  const resultHeader = result as ResultSetHeader;

  const [result2] = await connection.query('SELECT * FROM locations WHERE id = ?', [resultHeader.insertId]);
  const data = result2 as Location[];

  if (data.length === 0) {
    res.status(404).send('Could not create location.');
  } else {
    res.send(data[0]);
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  const connection = mysqlDb.getConnection();

  const [result] = await connection.query('SELECT id FROM resources WHERE location_id = ?', [id]);
  const data = result as Location[];

  if (data.length !== 0) {
    res.status(409).send('Cannot delete location because it is being referenced by a resource.');
    return;
  }

  void (await connection.query('DELETE FROM locations WHERE id = ?', [id]));

  res.send(null);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  if (!req.body.name) {
    res.status(400).send('Name is required.');
    return;
  }

  const body: LocationBody = {
    name: req.body.name,
    description: req.body.description ?? null,
  };

  const connection = mysqlDb.getConnection();
  void (await connection.query('UPDATE locations SET name = ?, description = ? WHERE id = ?', [body.name, body.description, id]));

  const [result] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);
  const data = result as Location[];

  if (data.length === 0) {
    res.status(404).send('Could not update location.');
  } else {
    res.send(data[0]);
  }
});

export default router;
