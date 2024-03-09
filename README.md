PS D:\SDN301-BE> npm -v
10.2.4
PS D:\SDN301-BE> node -v
v18.19.1


Login:
http://localhost:5000/api/accounts/login

{
  "username": "admin02",
  "password": "123456"
}

admin: admin02
pass: 1234567

staff: staff02
pass: 123456

customer: duyhieudeptrai
pass: 123456

default role register ( customer )


Get Account Profile:
http://localhost:5000/api/accounts/profile

Admin Get All Account:
http://localhost:5000/api/accounts/all

Update Profile:
http://localhost:5000/api/accounts/profile

Admin Delete Account:
http://localhost:5000/api/accounts/

Reset Password:
http://localhost:5000/api/accounts/requestPasswordReset

Register:
http://localhost:5000/api/accounts/register
{
  "firstName": "Customer",
  "lastName": "Hieu",
  "email": "buihieuduy@gmail.com",
  "dateOfBirth": "2023-01-01",
  "address": "120 Nguyễn Tri Phương, p7, TP.Vũng Tàu",
  "phone": "0369776640",
  "username": "dyhieu",
  "password": "123456"
}

Product:

Create Product:
http://localhost:5000/api/products/

{
    "productName": "Bàn Gaming chữ K",
    "productPrice": 1200,
    "productImage": "https://nld.mediacdn.vn/2016/chuoitrinutgotchan-1479781920955.jpg",
    "productSize": "120x240",
    "productType": "Bàn",
    "dateImport": "02-02-2024",
    "productQuantity": 5,
    "productMaterial": "Perfect Sắt",
    "productDescription": "Chiếc bàn Gaming bao chất."
}

Get All Products:
http://localhost:5000/api/products/

Get Product By Id:
http://localhost:5000/api/products/65e453eaafa2d5255355046b

Get Product By Name: ( ký tự liên quan )
http://localhost:5000/api/products/name/gaming

Update Product:
http://localhost:5000/api/products/65e453eaafa2d5255355046b

{
    "productPrice": 1200,
    "productQuantity": 5,
    "productType": "Ghế"
}

Delete Product:
http://localhost:5000/api/products/65e4add33a4ae29b521ef80d




Quotation:
Get all Quotation:
http://localhost:5000/api/standard-quotations/all

Create Quotation:
http://localhost:5000/api/standard-quotations/

{
  "quotationName": "Bọc ghế sofa",
  "quotationDescription": "Bọc ghế sofa da beo cao cấp.",
  "quotationCategory": "Nội thất cao cấp",
  "quotationPrice": 1000,
  "quotationManagedBy": "65ddd3007298f652b9db91c2",
}

Update Quotation:
http://localhost:5000/api/standard-quotations/65e61c9536d85f28ba04c77c

    {
        "quotationName": "Ốp gỗ",
        "quotationDescription": "Ốp gỗ mun vip.",
        "quotationCategory": "Nội thất cao cấp",
        "quotationPrice": 1000,
        "quotationManagedBy":"65e8b775c31f50c9e3bec743",
        "role": "staff",
        "status": "active"

    }


Nhớ thêm JWT cho mỗi api
Staff thì lấy token của staff
Admin thì lấy token của admin
Customer cũng thế