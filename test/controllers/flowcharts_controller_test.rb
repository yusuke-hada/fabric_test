require "test_helper"

class FlowchartsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get flowcharts_index_url
    assert_response :success
  end

  test "should get new" do
    get flowcharts_new_url
    assert_response :success
  end

  test "should get create" do
    get flowcharts_create_url
    assert_response :success
  end
end
