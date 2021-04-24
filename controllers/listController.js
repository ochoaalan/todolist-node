const { Item, defaultItems } = require('../models/item');
const List = require('../models/list');
const _ = require('lodash');

const favicon_request = (req, res) => {
  res.status(204);
  res.end(); 
}

const list_index = (req, res) => {
  Item.find()
  .then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
        .then((result) => {
          console.log(`Successfully inserted ${defaultItems} items!`);
        })
        .catch((err) => console.error(`Failed to insert documents: ${err}`));

      res.redirect("/");
    } else {
      List.find()
      .then((lists) => {
        res.render("list", {
          lists: lists,
          listTitle: "Today",
          newListItems: foundItems,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
}

const list_create_get = (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {

      if (foundList) {
        console.log(`Found this list: ${foundList.name}`);

        List.find()
        .then((lists) => {
          res.render("list", {
            lists: lists,
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
  
        list
          .save()
          .then((result) => {
            console.log(`Created this list: ${result.name}`);
            res.redirect("/" + customListName);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      //console.log(err);
    });
}

const list_item_post = (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item
      .save()
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(item);

        foundList.save()
          .then((result) => {
            res.redirect("/" + listName);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const list_create_post = (req, res) => {
  const customListName = _.capitalize(req.body.newList);
  console.log(customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      console.log(foundList);
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save()
          .then((result) => {
            res.redirect("/" + customListName);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.redirect("/" + customListName);
      }
    })
    .catch((err) => {
      console.log(`found nothing ${err}`);
    });
}

const list_delete = (req, res) =>  {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then((result) => {
        console.log("deleted" + result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
      .then((result) => {
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = {
  favicon_request,
  list_index,
  list_create_get,
  list_item_post,
  list_create_post,
  list_delete
}