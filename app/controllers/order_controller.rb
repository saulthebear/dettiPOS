class OrderController < ApplicationController
  def new
    @categories_by_levels = Category.by_levels
    @products = Product.all
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
