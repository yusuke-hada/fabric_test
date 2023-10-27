class CreateFlowcharts < ActiveRecord::Migration[7.0]
  def change
    create_table :flowcharts do |t|
      t.text :data
      t.timestamps
    end
  end
end
