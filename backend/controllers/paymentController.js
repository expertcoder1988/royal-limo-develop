import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import { PAYMENT_CURRENCY, SQUARE_ACCESS_TOKEN } from "../utils/constants.js";
import UserSchema from "../models/users.js";
import bookings from "../models/bookings.js";
import transactionSchema from "../models/transaction.js";

const { paymentsApi, cardsApi } = new Client({
  accessToken: SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const makePayment = async (req, res) => {
  try {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: PAYMENT_CURRENCY,
        amount: 100,
      },
    });
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send();
  }
};

export const getCards = async (req, res) => {
  const userId = req.user.id;

  try {
    const fetchedUser = await UserSchema.findById(userId);

    const {
      result: { cards },
    } = await cardsApi.listCards(undefined, fetchedUser.squareId);

    const filteredCards = cards.filter(
      (card) => card.customerId === fetchedUser.squareId
    );

    const formattedCards = filteredCards.map((card) => ({
      ...card,
      expMonth: Number(card.expMonth),
      expYear: Number(card.expYear),
      version: Number(card.version),
    }));
    res.status(200).json(formattedCards);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserCards = async (req, res) => {
  try {
    const booking = await bookings.findById(req.params.id);
    const userId = booking.user.toString();
    const fetchedUser = await UserSchema.findById(userId);
    if (!fetchedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!fetchedUser.squareId) {
      return res.status(404).json({ error: "Square Id not found" });
    }
    const {
      result: { cards },
    } = await cardsApi.listCards(undefined, fetchedUser.squareId);

    const filteredCards = cards.filter(
      (card) => card.customerId === fetchedUser.squareId
    );

    const formattedCards = filteredCards.map((card) => ({
      ...card,
      expMonth: Number(card.expMonth),
      expYear: Number(card.expYear),
      version: Number(card.version),
    }));
    res.status(200).json(formattedCards);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getCard = async (req, res) => {
  try {
    const {
      result: { card },
    } = await cardsApi.retrieveCard(req.params.id);
    res.status(200).json({
      ...card,
      expMonth: Number(card.expMonth),
      expYear: Number(card.expYear),
      version: Number(card.version),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const disableCard = async (req, res) => {
  try {
    const {
      result: { card },
    } = await cardsApi.disableCard(req.params.id);
    res.status(200).json({
      ...card,
      expMonth: Number(card.expMonth),
      expYear: Number(card.expYear),
      version: Number(card.version),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { bookingId, amount, token } = req.body;
    const booking = await bookings.findById(bookingId);
    const userId = booking.user.toString();
    const fetchedUser = await UserSchema.findById(userId);
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: token,
      amountMoney: {
        currency: PAYMENT_CURRENCY,
        amount: amount,
      },
      customerId: fetchedUser?.squareId,
    });
    const transaction = new transactionSchema({
      booking: bookingId,
      amount: parseInt(amount),
    });

    const savedTransaction = await transaction.save();

    await bookings.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "fully_paid" },
      { new: true }
    );

    console.log(savedTransaction);
    res.status(200).json(savedTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
