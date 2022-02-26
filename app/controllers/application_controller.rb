class ApplicationController < ActionController::Base
  helper_method :current_user,
                :login!,
                :logout!,
                :require_user

  # Returns the currently signed in user
  # or nil if no user is signed in
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

  # Redirects unless an approved user is signed in
  # New users need to be approved by an admin
  def require_user
    if current_user
      unless current_user.approved
        flash[:alert] = ['Your account has not been approved yet. Contact your manager.']
        logout!
        redirect_to new_session_url
      end
    else
      flash[:alert] = ['You must be signed in to access this resource.']
      redirect_to new_session_url
    end
  end

  # Redirects unless the current user is an admin
  def require_admin
    unless current_user&.role == 'Admin'
      flash[:alert] = ['Admin access needed!']
      redirect_to :root
    end
  end
end
