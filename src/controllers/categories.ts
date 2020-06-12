import { Router } from 'express';
import { getAllCategories, categoriesModel, addCategory, deleteCategory } from '../models/category';

export const router = Router();

router.get('/', (req, res) => {
  getAllCategories().then((categories) => {
    res.write(JSON.stringify({ success: true, categories: categories }, null, 2));
    res.end();
  }, (err) => {
    console.error(err);
    res.sendStatus(500);
  })
});

router.post('/', (req, res) => {
  let newCategory = new categoriesModel({
    name: req.body.name
  });

  addCategory(newCategory).then(() => {
    res.sendStatus(200);
  }, (err) => {
    console.error(err);
    res.sendStatus(500);
  })
});

router.delete('/:name', (req, res) => {
  deleteCategory(req.params.name).then(() => {
    res.sendStatus(200);
  }, (err) => {
    console.error(err);
    res.sendStatus(500);
  })
});
