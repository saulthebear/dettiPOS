class OrderController < ApplicationController
  def new
    @categories_by_parent_id = Category.by_parent_id
    @products_by_category_id = Product.by_category_id
  end

  def create
    order = Order.new

    items = order_params[:items].map do |item_params|
      order_item = OrderItem.new(item_params)
      order_item.order = order
      order_item
    end
    order.order_items = items

    if order.save
      render json: order
    else
      render json: order.errors.full_messages
    end
  end

  private

  def order_params
    params.require(:order).permit(items: %i[
                                    product_id
                                    quantity
                                  ])
  end
end
