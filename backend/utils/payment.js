import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import { PAYMENT_CURRENCY, SQUARE_ACCESS_TOKEN } from "../utils/constants.js";
import UserSchema from "../models/users.js";

const { paymentsApi, cardsApi, customersApi } = new Client({
  accessToken: SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const makePayment = async (
  token,
  amount,
  customerId,
  customerName,
  save = false,
  user
) => {
  try {
    let idempotencyKey = randomUUID();
    const fetchedUser = await UserSchema.findById(user.id);
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: idempotencyKey,
      sourceId: token,
      amountMoney: {
        currency: PAYMENT_CURRENCY,
        amount: amount * 100,
      },
      customerId: fetchedUser?.squareId,
    });
    if (save) {
      if (!customerName) {
        throw new Error("Card holder name is required");
      }

      if (!fetchedUser.squareId) {
        try {
          const response = await customersApi.createCustomer({
            givenName: fetchedUser.firstname,
            emailAddress: fetchedUser.email,
            phoneNumber: fetchedUser.phoneNo,
            referenceId: fetchedUser.id,
          });

          await UserSchema.findByIdAndUpdate(
            user.id,
            { squareId: response.result.customer.id },
            { new: true }
          );
        } catch (error) {
          console.log(error);
        }
      }
      const User = await UserSchema.findById(user.id);
      const response = await cardsApi.createCard({
        idempotencyKey: idempotencyKey,
        sourceId: result.payment.id,
        card: {
          cardholderName: customerName,
          customerId: User.squareId,
          referenceId: User.id,
        },
      });
      console.log(response.result);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
