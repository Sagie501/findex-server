import { Router } from 'express';
import { editUser, getAllUsers, getUserById, getUserByUsernameAndPassword } from '../models/users';

export const router = Router();

router.get('/', (req, res) => {
  getAllUsers().then((users) => {
    res.write(JSON.stringify({ success: true, users: users }, null, 2));
    res.end();
  }, (err) => {
    res.json({success:false, message: `Failed to load all users. Error: ${err}`});
  });
});

router.get('/:username/:password', (req, res) => {
  getUserByUsernameAndPassword(req.params.username, req.params.password).then((user) => {
    if (user != null) {
      res.write(JSON.stringify({ success: true, user: user }, null, 2));
    } else {
      res.write(JSON.stringify({ success: false, user: user }, null, 2));
    }
    res.end();
  }, (err) => {
    res.json({success:false, message: `Failed to find user. Error: ${err}`});
  });
});

router.get('/:id', (req, res) => {
  getUserById(req.params.id).then((user) => {
    res.write(JSON.stringify({ success: true, user: user }, null, 2));
    res.end();
  }, (err) => {
    res.json({success:false, message: `Failed to find user by ID. Error: ${err}`});
  });
});

router.post('/', (req, res) => {
  let newUser = {
    password: req.body.password,
    fullName: req.body.fullName,
    username: req.body.username,
    phone: req.body.phone,
    city: req.body.city,
  };

  editUser(newUser).then((newUser) => {
    res.json({success:true, message: `Added successfully: ${newUser}`});
  }, (err) => {
    res.json({success: false, message: `Failed to create a new user. Error: ${err}. req: ${req}`});
  });
});
