from util.api import Api

get_data = Api()

countries = ["Zambia", "Malawi", "Mozambique"]
get_data.datatable(7283, "grand_parent", "yearly", "2019", countries)
get_data.datatable(7950, "grand_parent", "yearly", "2019", countries)
