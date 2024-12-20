import express from 'express';
import mysqlDb from '../mysqlDb';
import { Category, CategoryBody } from '../types';
import { ResultSetHeader } from 'mysql2/promise';

const router = express.Router();

router.get('/', async (req, res) => {
  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT id, name FROM categories');
  const data = result as Category[];

  res.send(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
  const data = result as Category[];

  if (data.length === 0) {
    res.status(404).send('Category not found.');
  } else {
    res.send(data[0]);
  }
});

router.post('/', async (req, res) => {
  if (!req.body.name) {
    res.status(400).send('Name is required.');
    return;
  }

  const body: CategoryBody = {
    name: req.body.name,
    description: req.body.description ?? null,
  };

  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('INSERT INTO categories (name, description) VALUES (?, ?)', [body.name, body.description]);
  const resultHeader = result as ResultSetHeader;

  const [result2] = await connection.query('SELECT * FROM categories WHERE id = ?', [resultHeader.insertId]);
  const data = result2 as Category[];

  if (data.length === 0) {
    res.status(404).send('Could not create category.');
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

  const [result] = await connection.query('SELECT id FROM resources WHERE category_id = ?', [id]);
  const data = result as Category[];

  if (data.length !== 0) {
    res.status(409).send('Cannot delete categery because it is being referenced by a resource.');
    return;
  }

  void (await connection.query('DELETE FROM categories WHERE id = ?', [id]));

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

  const body: CategoryBody = {
    name: req.body.name,
    description: req.body.description ?? null,
  };

  const connection = mysqlDb.getConnection();
  void (await connection.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [body.name, body.description, id]));

  const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
  const data = result as Category[];

  if (data.length === 0) {
    res.status(404).send('Could not update category.');
  } else {
    res.send(data[0]);
  }
});

export default router;
