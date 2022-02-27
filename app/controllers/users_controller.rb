class UsersController < ApplicationController
  before_action :require_admin, except: %i[new create]
  before_action :set_user, only: %i[show update destroy]

  def new
    @user = User.new
  end

  def create
    user = User.new(user_params)
    if user.save
      redirect_to :root, notice: ['Account created sucessfully.']
    else
      redirect_to new_user_url, status: :unprocessable_entity, alert: user.errors.full_messages
    end
  end

  def index
    @users = User.all.order(:id)
  end

  def update
    if @user.update(admin_user_params)
      redirect_to users_url, notice: ['Account updated successfully']
    else
      redirect_to users_url, status: :unprocessable_entity, alert: @user.errors.full_messages
    end
  end

  def destroy
    if @user.destroy
      redirect_to users_url, notice: ['Account removed successfully']
    else
      redirect_to users_url, status: :unprocessable_entity, alert: @user.errors.full_messages
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :username, :password)
  end

  # Params only an admin is allowed to edit
  def admin_user_params
    params.require(:user).permit(:name, :username, :role, :approved)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
