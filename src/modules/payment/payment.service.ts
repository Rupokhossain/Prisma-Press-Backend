import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import { Order, User } from "../../../generated/prisma/client";
import axios from "axios";


type TPaymentUser = {
  id: string;
  name: string;
  email: string;
};

const initiatePayment = async (order: Order, user: TPaymentUser) => {
  const tranId = `TRNX_ID_${Date.now()}`;

  const paymentData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_password,
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id: tranId,
    success_url: "http://yoursite.com/success.php",
    fail_url: "http://yoursite.com/fail.php",
    cancel_url: "http://yoursite.com/cancel.php",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: 1000,
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
  };

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    paymentData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const data = await response.data;

  console.log(data);

  return data;
};


export const paymentService = {
  initiatePayment
}
