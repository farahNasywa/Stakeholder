import EngagementStrategy from "../models/engagementStrategyModel.js";

export const createEngagementStrategy = async (req, res) => {
  try {
    const newStrategy = new EngagementStrategy(req.body);
    const savedStrategy = await newStrategy.save();
    res.status(201).json(savedStrategy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllEngagementStrategies = async (req, res) => {
  try {
    const strategies = await EngagementStrategy.find();
    res.status(200).json(strategies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEngagementStrategyById = async (req, res) => {
  try {
    const strategy = await EngagementStrategy.findById(req.params.id);
    if (!strategy) return res.status(404).json({ message: "Strategy not found" });
    res.status(200).json(strategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEngagementStrategy = async (req, res) => {
  try {
    const updated = await EngagementStrategy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Strategy not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEngagementStrategy = async (req, res) => {
  try {
    const deleted = await EngagementStrategy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Strategy not found" });
    res.status(200).json({ message: "Strategy deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
