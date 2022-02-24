class OrdersController < ApplicationController
  def new
    @categories = Category.with_ancestors_by_levels
    @products_with_ancestors = Product.with_ancestors

    render :new
  end

  def create
    order = Order.new
    items = order_params[:items].map do |item_params|
      order_item = OrderItem.new(item_params)
      order_item.order = order
      order_item
    end
    order.order_items = items

    payment = Payment.new(order_params[:payment])
    payment.order = order
    payment.amount = order.total_price

    if order.save && payment.save
      flash[:alerts] = ['Order placed successfully!']
      redirect_to new_order_url
    else
      flash[:errors] = order.errors.full_messages + payment.errors.full_messages
      redirect_to new_order_url
    end
  end

  private

  def order_params
    params.require(:order).permit(items: %i[product_id quantity],
                                  payment: [:payment_type])
  end
end
