# == Schema Information
#
# Table name: categories
#
#  id         :bigint           not null, primary key
#  name       :string
#  parent_id  :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  after_initialize :handle_zero_parent

  belongs_to :parent,
             class_name: :Category,
             foreign_key: :parent_id,
             inverse_of: :subcategories,
             optional: true

  has_many :subcategories,
           class_name: :Category,
           foreign_key: :parent_id,
           inverse_of: :parent,
           dependent: :destroy

  has_many :products,
           inverse_of: :category,
           dependent: :destroy

  # Returns a hash, with parent_id => category instance
  # This is useful for getting all categories at once
  # and then displaying them in their proper nested structure
  def self.by_parent_id
    categories = all

    hash = Hash.new { |h, k| h[k] = [] }

    categories.each do |category|
      hash[category.parent_id].append(category)
    end
    hash
  end

  # Hash where category id => category instance
  # Used to get all categories with one DB call and still be able to find
  # a particular category by its id
  def self.category_map
    Category.all.map { |category| [category.id, category] }.to_h
  end

  # Returns a hash where category object => array of ancestor ids
  def self.ancestor_map
    category_by_id = category_map

    hash = {}

    all.each do |category|
      hash[category] = category.all_ancestor_ids(category_by_id)
    end

    hash
  end

  # Returns a 2D array, where each row is a tuple of the category object and an
  # array of all that category's ancestor ids
  def self.with_ancestors
    category_map = self.category_map

    all.map do |category|
      [category, category.all_ancestor_ids(category_map)]
    end
  end

  def self.with_ancestors_by_levels
    category_map = self.category_map
    all_levels = Hash.new { |h, k| h[k] = [] }

    ancestor_map.each do |category, ancestors|
      number_of_levels = ancestors.length
      all_levels[number_of_levels] << [category, category.all_ancestor_ids(category_map)]
    end

    all_levels
  end

  def all_ancestor_ids(category_map)
    current_id = category_map[id].parent_id
    ancestor_ids = []

    until current_id.nil?
      ancestor_ids << current_id
      current_id = category_map[current_id].parent_id
    end

    ancestor_ids
  end

  private

  def handle_zero_parent
    self.parent_id = nil if parent_id == 0
  end
end
