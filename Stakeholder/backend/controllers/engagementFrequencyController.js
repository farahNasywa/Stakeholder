import EngagementFrequency from "../models/engagementFrequencyModel.js";

// Create new frequency
export const createEngagementFrequency = async (req, res) => {
  try {
    const { name } = req.body;
    const newFrequency = new EngagementFrequency({ name });
    await newFrequency.save();
    res.status(201).json(newFrequency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all frequencies
export const getAllEngagementFrequencies = async (req, res) => {
  try {
    const frequencies = await EngagementFrequency.find();
    res.status(200).json(frequencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get frequency by ID
export const getEngagementFrequencyById = async (req, res) => {
  try {
    const frequency = await EngagementFrequency.findById(req.params.id);
    if (!frequency) {
      return res.status(404).json({ error: "Engagement frequency not found" });
    }
    res.status(200).json(frequency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update frequency by ID
export const updateEngagementFrequency = async (req, res) => {
  try {
    const updatedFrequency = await EngagementFrequency.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedFrequency) {
      return res.status(404).json({ error: "Engagement frequency not found" });
    }
    res.status(200).json(updatedFrequency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete frequency by ID
export const deleteEngagementFrequency = async (req, res) => {
  try {
    const deleted = await EngagementFrequency.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Engagement frequency not found" });
    }
    res.status(200).json({ message: "Engagement frequency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
