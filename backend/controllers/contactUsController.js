import { validationResult } from "express-validator";
import ContactUs from "../models/contactUs.js";

export const submitForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { firstname, lastname, email, phoneNo, message } = req.body;

    const contactUsEntry = new ContactUs({
      firstname,
      lastname,
      email,
      phoneNo,
      message,
    });

    const savedEntry = await contactUsEntry.save();

    res.status(201).json(savedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: "Failed to create contact us entry" });
  }
};

export const getForms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const sortOptions = {};

  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    sortOptions[sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  try {
    const totalCount = await ContactUs.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await ContactUs.find()
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getForm = async (req, res) => {
  const formId = req.params.formId;

  try {
    const contactUsEntry = await ContactUs.findById(formId);

    if (!contactUsEntry) {
      return res.status(404).json({ error: "Contact form entry not found" });
    }

    res.status(200).json(contactUsEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contact form entry" });
  }
};

export const deleteForm = async (req, res) => {
  const formId = req.params.formId;

  try {
    const deletedContactUs = await ContactUs.findByIdAndDelete(formId);

    if (!deletedContactUs) {
      return res.status(404).json({ error: "Contact form entry not found" });
    }

    res
      .status(200)
      .json({ message: "Contact form entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete contact form entry" });
  }
};
