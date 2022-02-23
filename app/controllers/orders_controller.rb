class OrdersController < ApplicationController
  def new
    @categories = Category.with_ancestors_by_levels

    @products_with_ancestors = Product.with_ancestors

    render :new
  end

  def create
    order = Order.new
    items = order_params.map do |item_params|
      order_item = OrderItem.new(item_params)
      order_item.order = order
      order_item
    end
    order.order_items = items

    if order.save
      flash.now[:alerts] = ['Order placed successfully!']
      redirect_to new_order_url
    else
      flash.now[:errors] = order.errors.full_messages
      render :new
    end
  end

  private

  def order_params
    params.require(:order).require(:items).map do |item_params|
      item_params.permit(:product_id, :quantity)
    end
  end
end
