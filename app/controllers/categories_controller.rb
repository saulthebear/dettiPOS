class CategoriesController < ApplicationController
  before_action :set_category, only: %i[edit update destroy]

  def new
    @category = Category.new
    @categories_by_parent_id = Category.by_parent_id
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      redirect_to products_url, notice: ['Category was sucessfully created.']
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @categories_by_parent_id = Category.by_parent_id
  end

  def update
    if @category.update(category_params)
      redirect_to products_url, notice: ['Category was successfully updated.']
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :parent_id)
  end

  def set_category
    @category = Category.find(params[:id])
  end
end
