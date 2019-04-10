const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping-list service object`, function() {
  let db
  let testItems = [
    {
      id: 1,
      item_name: 'Face candy',
      item_price: '5.10',
      item_date_added: new Date('2029-01-22T16:28:32.615Z'),
      item_checked: false,
      item_category: 'Snack'
    },
    {
      id: 2,
      item_name: 'Steak',
      item_price: '22.20',
      item_date_added: new Date('2029-01-22T16:28:32.615Z'),
      item_checked: false,
      item_category: 'Breakfast'
    },
    {
      id: 3,
      item_name: 'Tea',
      item_price: '5.75',
      item_date_added: new Date('2029-01-22T16:28:32.615Z'),
      item_checked: false,
      item_category: 'Main'
    },
  ]

    
  before(() => {
      db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())
    
  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems)
    })

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
      .then(actual => {
        expect(actual).to.eql(testItems)
      })
    })

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testItems[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            item_name: thirdTestItem.item_name,
            item_price: thirdTestItem.item_price,
            item_date_added: thirdTestItem.item_date_added,
            item_checked: thirdTestItem.item_checked,
            item_category: thirdTestItem.item_category
          })
        })
    })

    it(`deleteById() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteById(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test articles array without the "deleted" article
          const expected = testItems.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
        })
    })

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        item_name: 'updated title',
        item_price: '10.05',
        item_date_added: new Date(),
        item_checked: true,
        item_category: 'Main',
      }
      return ShoppingListService.updateById(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          })
        })
    })

  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
      const newItem = {
        item_name: 'New shopping list item!',
        item_price: '1.05',
        item_date_added: new Date(),
        item_checked: false,
        item_category: 'Snack'
      }
      return ShoppingListService.insertItem(db, newItem)
       .then(actual => {
          expect(actual).to.eql({
            id: 1,
            item_name: newItem.item_name,
            item_price: newItem.item_price,
            item_date_added: newItem.item_date_added,
            item_checked: newItem.item_checked,
            item_category: newItem.item_category
          })
       })
    })

  })


})