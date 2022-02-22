const categories = $('.js-category');

categories.click((event) => {
  const category = event.currentTarget;
  const id = category.dataset['category_id'];

  console.log(`Category #${id} was clicked!`)
});

