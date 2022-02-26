class User < ApplicationRecord
  attr_reader :password

  validates :password, length: { minimum: 6, allow_nil: true }
  validates :username, :password_digest, presence: true, uniqueness: true
  validates :approved, inclusion: [true, false]

  enum role: %w[Cashier Admin]

  after_initialize :ensure_session_token

  def self.generate_session_token
    SecureRandom.urlsafe_base64(16)
  end

  def self.find_by_credentials(username, password)
    user = find_by(username: username)
    return user if user&.is_password?(password)

    nil
  end

  def self.find_by_session_token(token)
    find_by(session_token: token)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(potential_password)
    password = BCrypt::Password.new(password_digest)
    password.is_password?(potential_password)
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    save!
    session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
