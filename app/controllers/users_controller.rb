class UsersController < ApplicationController
  before_action :require_admin, except: %i[new create]

  def new; end

  def create; end

  def show; end

  def index; end
end
