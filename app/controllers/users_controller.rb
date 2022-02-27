class UsersController < ApplicationController
  before_action :require_admin, except: %i[new create]

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

  def show
    @user = User.find(params[:id])
  end

  def index
    @users = User.all
  end

  private

  def user_params
    params.require(:user).permit(:name, :username, :password)
  end
end
