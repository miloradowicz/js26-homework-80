import express from 'express';
import mysqlDb from '../mysqlDb';
import { Category, Location, Resource, ResourceBody } from '../types';
import { ResultSetHeader } from 'mysql2/promise';
import dayjs from 'dayjs';
import { imageUpload } from '../multer';

const router = express.Router();

router.get('/', async (req, res) => {
  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT id, name FROM resources');
  const data = result as Resource[];

  res.send(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  const connection = mysqlDb.getConnection();
  const [result] = await connection.query('SELECT * FROM resources WHERE id = ?', [id]);
  const data = result as Resource[];

  if (data.length === 0) {
    res.status(404).send('Location not found.');
  } else {
    res.send(data[0]);
  }
});

router.post('/', imageUpload.single('photo'), async (req, res) => {
  if (!req.body.category_id || !req.body.location_id || !req.body.name) {
    res.status(400).send('Category_id, location_id, and name are required.');
    return;
  }

  const body: ResourceBody = {
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    name: req.body.name,
    description: req.body.description ?? null,
    photo_url: req.file ? req.file.filename : null,
    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };

  const connection = mysqlDb.getConnection();

  let [r] = await connection.query('SELECT * FROM categories WHERE id = ?', [body.category_id]);
  if ((r as Category[]).length === 0) {
    res.status(400).send('Invalid category.');
    return;
  }

  [r] = await connection.query('SELECT * FROM locations WHERE id = ?', [body.location_id]);
  if ((r as Location[]).length === 0) {
    res.status(400).send('Invalid location.');
    return;
  }

  const [result] = await connection.query(
    'INSERT INTO resources (category_id, location_id, name, description, photo_url, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [body.category_id, body.location_id, body.name, body.description, body.photo_url, body.created_at]
  );
  const resultHeader = result as ResultSetHeader;

  const [result2] = await connection.query('SELECT * FROM resources WHERE id = ?', [resultHeader.insertId]);
  const data = result2 as Resource[];

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
  void (await connection.query('DELETE FROM resources WHERE id = ?', [id]));

  res.send(null);
});

router.put('/:id', imageUpload.single('photo'), async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send('Invalid id.');
  }

  if (!req.body.category_id || !req.body.location_id || !req.body.name) {
    res.status(400).send('Category_id, location_id, and name are required.');
    return;
  }

  const body: ResourceBody = {
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    name: req.body.name,
    description: req.body.description ?? null,
    photo_url: req.file ? req.file.filename : null,
    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };

  const connection = mysqlDb.getConnection();

  let [r] = await connection.query('SELECT * FROM categories WHERE id = ?', [body.category_id]);
  if ((r as Category[]).length === 0) {
    res.status(400).send('Invalid category.');
    return;
  }

  [r] = await connection.query('SELECT * FROM locations WHERE id = ?', [body.location_id]);
  if ((r as Location[]).length === 0) {
    res.status(400).send('Invalid location.');
    return;
  }

  void (await connection.query(
    'UPDATE resources SET category_id = ?, location_id = ?,  name = ?, description = ?, photo_url = ?, created_at = ? WHERE id = ?',
    [body.category_id, body.location_id, body.name, body.description, body.photo_url, body.created_at, id]
  ));

  const [result] = await connection.query('SELECT * FROM resources WHERE id = ?', [id]);
  const data = result as Resource[];

  if (data.length === 0) {
    res.status(404).send('Could not create location.');
  } else {
    res.send(data[0]);
  }
});

export default router;
