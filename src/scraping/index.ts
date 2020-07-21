import * as rq from 'request-promise';
import * as $ from 'cheerio';
import { getCategoryByName } from '../models/category';
import { addItemToUser, getUserByUsername } from '../models/users';
import { createNewItem, itemsModel } from '../models/item';
import * as mongoose from 'mongoose';
import { Config } from '../environment/config';
import { Environment } from '../environment/environment';

const url = 'https://www.agora.co.il/toGet.asp?dealType=1&dealStatus=1';

const config: Config = Environment.getConfig();

// Connect mongoose to our database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

  let html = await rq(url);

  let itemsList = $('tbody', html).filter('.objectGroup').toArray();

  for (let i = 0; i < itemsList.length; i++) {
    let cheerioItem = $(itemsList[i]);
    let result = await Promise.all([getCategoryByName('Scraping'), getUserByUsername('Scraping')]);
    let newItem = new itemsModel({
      name: cheerioItem.find('.objectName').text(),
      description: cheerioItem.find('.detailsPreview').text(),
      kind: 'ForDelivery',
      category: result[0],
      city: cheerioItem.find('.area').text(),
      username: result[1]._id
    });
    await createNewItem(newItem);
    (newItem as any).username = 'Scraping'
    addItemToUser(newItem, 'Scraping', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Added successfully.')
      }
    });
  }
});
