require('dotenv').config()

const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function searchByProduceName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('item_name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

//searchByProduceName('fish');

function paginateProducts(page) {
  const productsPerPage = 6
  const offset = productsPerPage * (page - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

//paginateProducts(2);

function itemsAfterDay(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'item_date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result)
    })
}

//itemsAfterDay(1);

function costPerCategory() {
  knexInstance
    .select('item_category')
    .count('item_price as total')
    .from('shopping_list')
    .groupBy('item_category')
    .then(result => {
      console.log('COST PER CATEGORY')
      console.log(result)
    })
}

costPerCategory()