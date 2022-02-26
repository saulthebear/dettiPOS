class ApplicationController < ActionController::Base
  helper_method :current_user,
                :login!,
                :logout!

  def current_user
    token = session[:session_token]
    return nil unless token

    @current_user ||= User.find_by_session_token(token)
  end

  def login!(user)
    token = user.reset_session_token!
    session[:session_token] = token
    @current_user = user
  end

  def logout!
    return if current_user.nil?

    @current_user.reset_session_token!
    session[:session_token] = nil
  end
end
