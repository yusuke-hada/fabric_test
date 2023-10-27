class FlowchartsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  def index
  end

  def new
  end

  def create
    json_data = params[:json_data]
    # JSONデータをFlowchartモデルに保存
    flowchart = Flowchart.new(data: json_data)
    if flowchart.save
      render json: { message: 'データが保存されました' }
    else
      render json: { error: 'データの保存に失敗しました' }, status: :unprocessable_entity
    end
  end
end
