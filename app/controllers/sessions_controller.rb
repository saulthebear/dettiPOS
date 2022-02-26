class SessionsController < ApplicationController
  # Login form
  def new; end

  # Login action
  def create
    @user = User.find_by_credentials(session_params[:username], session_params[:password])
    if @user
      login!(@user)
      redirect_to :root
    else
      flash.now[:alert] = ['Incorrect credentials']
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    logout!
    redirect_to :root
  end

  private

  def session_params
    params.require(:session).permit(:username, :password)
  end
end
