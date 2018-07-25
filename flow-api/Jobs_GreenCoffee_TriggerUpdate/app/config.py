tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
instanceURI = 'greencoffee'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI

keymd5 = 'c946415addc376cc50c91956a51823f1'
postURI = 'http://118.70.171.49:64977/WebService.asmx'

rtData = {
    'client_id':'curl',
    'username':'deden@akvo.org',
    'password':'Jalanremaja1208',
    'grant_type':'password',
    'scope':'openid offline_access'
}

accounts = [
        {"id": "9","name": "camau","fname": "camau","pass": "123"},
	{"id": "10","name": "admin","fname": "Vũ Xuân Thành","pass": "1234"},
	{"id": "11","name": "thuy","fname": "dongthap","pass": "123"},
	{"id": "217","name": "nguyen","fname": "soctrang","pass": "123"},
	{"id": "222","name": "hoan","fname": " Cư M'gar","pass": "123"},
	{"id": "226","name": "thuyhangdili","fname": "Thúy Hằng","pass": "123"},
	{"id": "228","name": "myhieu25021988","fname": "Đặng thị mỹ hiếu","pass": "123"},
	{"id": "230","name": "caoduongthanhhnd","fname": "Cao Dương Thành","pass": "123"},
	{"id": "231","name": "trang123","fname": "Nguyễn Thị Lương","pass": "123"},
	{"id": "233","name": "hai123","fname": "Nguyễn hữu Mến","pass": "123"},
	{"id": "234","name": "phuc123","fname": "Trần Thị Liên","pass": "123"},
	{"id": "235","name": "myhoa","fname": "Nguyễn Thị Mỹ Hòa","pass": "123"},
	{"id": "236","name": "duc123","fname": "Phan Quang Đức","pass": "11111811Pq"},
	{"id": "237","name": "Trung123","fname": "Nguyễn Tấn Trung","pass": "123"},
	{"id": "238","name": "Linh123","fname": "Đặng Thị Linh","pass": "123"},
	{"id": "239","name": "xuan123","fname": "Võ Thị Thanh Xuân","pass": "11111811Pq"}
]

headers = {'Content-Type': 'application/x-www-form-urlencoded'}

def payload(keyval):
    strres = ''
    for i, dt in enumerate(keyval):
        if i == 0:
            strres = dt['key'] + '=' + dt['value']
        else:
            if dt['key'] == 'Date_var':
                date_conv = dt['value'].replace('/','%2F')
                strres = strres + '&' + dt['key'] + '=' + date_conv
            else:
                strres = strres + '&' + dt['key'] + '=' + dt['value']
    return strres
