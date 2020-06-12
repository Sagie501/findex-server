import { Router } from 'express';
import {
  createNewItem,
  getAllItems,
  getItemsAmountByKind,
  getItemsAmountInEachCategory,
  getItemsByCategory,
  getItemsByUserId,
  itemsModel
} from '../models/item';
import { addItemToUser, getUserByUsername } from '../models/users';
import { getCategoryByName } from '../models/category';

export const router = Router();

router.get('/', (req, res) => {
  getAllItems().then((items) => {
    res.write(JSON.stringify({ success: true, items: items }, null, 2));
    res.end();
  }, (err) => {
    res.json({ success: false, message: `Failed to load all items. Error: ${err}` });
  });
});

router.get('/byUser/:username', (req, res) => {
  getUserByUsername(req.params.username).then((user) => {
    getItemsByUserId(user._id).then((items) => {
      res.write(JSON.stringify({ success: true, items: items }, null, 2));
      res.end();
    }, (err) => {
      res.json({ success: false, message: `Failed to load items by user ${req.params.username}. Error: ${err}` });
    });
  }, (err) => {
    res.json({ success: false, message: `Failed to load items by user ${req.params.username}. Error: ${err}` });
  });
});

router.get('/byCategory/:category', (req, res) => {
  getCategoryByName(req.params.category).then((categoryId) => {
    getItemsByCategory(categoryId, (err, item) => {
      if (err) {
        res.json({ success: false, message: `Failed to get item by category. Error: ${err}` });
      } else {
        res.write(JSON.stringify({ success: true, item: item }, null, 2));
        res.end();
      }
    });
  }, (err) => {
    res.json({ success: false, message: `Failed to get item by category. Error: ${err}` });
  });
});

router.post('/', (req, res) => {
  Promise.all([getCategoryByName(req.body.category), getUserByUsername(req.body.username)]).then(([category, user]) => {
    let newItem = new itemsModel({
      name: req.body.name,
      description: req.body.description,
      kind: req.body.kind,
      category: category,
      city: req.body.city,
      username: user._id
    });

    createNewItem(newItem).then(() => {
      (newItem as any).username = req.body.username;
      addItemToUser(newItem, req.body.username, (err) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json({ success: true, message: "Added successfully.", item: newItem.populate("username") });
        }
      });
    }, (err) => {
      console.error(err);
      res.json({ success: false, message: `Failed to create a new item. Error: ${err}. req: ${req}` });
    });
  }, (err) => {
    res.json({ success: false, message: `Failed to create a new item. Error: ${err}. req: ${req}` });
  });
});

router.get('/getItemsAmountInEachCategory', (req, res) => {
  getItemsAmountInEachCategory().then((result) => {
    res.json({ success: true, categories: result });
  }, (err) => {
    console.error(err);
    res.json({ success: false, message: `Failed to count items in each category. Error: ${err}. req: ${req}` });
  });
});

router.get('/getItemsAmountByKind', (req, res) => {
  getItemsAmountByKind().then((result) => {
    res.json({ success: true, items: result });
  }, (err) => {
    console.error(err);
    res.json({ success: false, message: `Failed to count items in each category. Error: ${err}. req: ${req}` });
  });
});

router.put('/:id', (req, res) => {
  itemsModel.findById({ _id: req.params.id }, (err, result: any) => {
    if (err) {
      res.json({ success: false, message: `Failed to find item to update. Error: ${err}` });
    } else {
      getCategoryByName(req.body.category).then((categoryFound) => {
        result.name = req.body.name;
        result.description = req.body.description;
        result.color = req.body.color;
        result.category = categoryFound;
        result.create_time = req.body.create_time;
        result.city = req.body.city;

        result.save(err => {
          if (err) {
            res.json({ success: false, message: `Failed to save updated item. Error: ${err}` });
          } else {
            res.json({ success: true, message: 'Item updated successfully.' });
          }
        })
      }, (err) => {
        res.json({ success: false, message: `Failed to find item to update. Error: ${err}` });
      });
    }
  });
});

router.delete('/:id', (req, res) => {
  itemsModel.deleteOne({ _id: req.params.id }, (err) => {
    if (err)
      res.json({ success: false, message: `Failed to delete item. Error: ${err}` });
    else {
      // TODO: add after add messages
      // message.deleteMany({item: id}, err => { if(err) {console.log(err)} });

      res.json({ success: true, message: `Item deleted successfuly` });
    }
  });
});

router.get('/search', async (req, res) => {
  let name = req.body.name;
  let kind = req.body.kind;
  let categoryName = req.body.category;
  let query: any = {};

  if (name == 'undefined') {
    name = "";
  }

  if (name != 'undefined') {
    query.name = new RegExp('.*' + name + '.*', "i");
  }

  if (req.body.kind != 'undefined') {
    query.kind = kind;
  }

  if (req.body.category != 'undefined') {
    query.category = await getCategoryByName(categoryName);
  }

  await itemsModel.find(query).populate('category').populate('username').exec((err, items) => {
    if (err) {
      res.json({ success: false, message: `Failed to load searched items. Error: ${err}` });
    } else {
      res.write(JSON.stringify({ success: true, items: items }, null, 2));
      res.end();
    }
  });
});
