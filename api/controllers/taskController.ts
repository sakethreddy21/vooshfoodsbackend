import { Request, Response } from "express";
import Task from "../models/Task";
import User from "../models/User";

// Create a new task
export async function createTask(req: Request, res: Response) {
  const { title, description, userID, columnID } = req.body;

  // Basic validation
  if (!title || !description || !userID || !columnID) {
    return res
      .status(400)
      .json({
        error: "All fields (title, description, userID, columnID) are required",
      });
  }

  if (![1, 2, 3].includes(columnID)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid columnID. It should be 1 (Todo), 2 (In-progress), or 3 (Completed).",
      });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid userID. User does not exist." });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      userID,
      columnID,
    });

    // Save the task to the database
    await newTask.save();

    // Send a success response
    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Get all tasks by userID
export async function getTasksByUserID(req: Request, res: Response) {
  const { userID } = req.params;

  try {
    const tasks = await Task.find({ userID });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Get a single task by todoID
export async function getTaskByID(req: Request, res: Response) {
  const { todoID } = req.params;

  try {
    const task = await Task.findById(todoID);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Delete a task by todoID
export async function deleteTaskByID(req: Request, res: Response) {
  const { todoID } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(todoID);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Update a task by todoID
export async function updateTaskByID(req: Request, res: Response) {
  const { todoID } = req.params;
  const { title, description, columnID } = req.body;

  // Basic validation
  if (!title || !description || !columnID) {
    return res
      .status(400)
      .json({
        error: "All fields (title, description, columnID) are required",
      });
  }

  if (![1, 2, 3].includes(columnID)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid columnID. It should be 1 (Todo), 2 (In-progress), or 3 (Completed).",
      });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      todoID,
      { title, description, columnID },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Function to calculate total cost for EVs and ICE vehicles
const calculateTotalCost = (details: any, usage: any, isEV = false) => {
  let totalCost: number;
  if (isEV) {
    const chargingCostTotal = details.trueRange
      ? details.chargingCost *
        (usage.monthlyKM / details.trueRange) *
        12 *
        usage.calculationDuration
      : 0;

    totalCost =
      details.vehiclePrice +
      chargingCostTotal +
      details.maintenanceCost * usage.calculationDuration +
      details.insuranceCost * usage.calculationDuration -
      (details.resaleValue / 100) * details.vehiclePrice;
  } else {
    const fuelCostTotal = details.vehicleMileage
      ? (details.fuelCost *
          (usage.monthlyKM * 12 * usage.calculationDuration)) /
        details.vehicleMileage
      : 0;

    totalCost =
      details.vehiclePrice +
      fuelCostTotal +
      details.maintenanceCost * usage.calculationDuration +
      details.insuranceCost * usage.calculationDuration -
      (details.resaleValue / 100) * details.vehiclePrice;
  }
  return isNaN(totalCost) ? 0 : totalCost; // Ensure valid return value
};

// Functions to create pie chart data
const createICEPieChartData = (iceDetails: any, customerUsage: any) => ({
  labels: ["Initial Purchase", "Fuel", "Maintenance", "Insurance"],
  datasets: [
    {
      data: [
        iceDetails.vehiclePrice,
        (iceDetails.fuelCost *
          (customerUsage.monthlyKM * 12 * customerUsage.calculationDuration)) /
          iceDetails.vehicleMileage || 0,
        iceDetails.maintenanceCost * customerUsage.calculationDuration || 0,
        iceDetails.insuranceCost * customerUsage.calculationDuration || 0,
      ],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    },
  ],
});

const createEVPieChartData = (evDetails: any, customerUsage: any) => {
  const chargingCostTotal = evDetails.trueRange
    ? evDetails.chargingCost *
      (customerUsage.monthlyKM / evDetails.trueRange) *
      12 *
      customerUsage.calculationDuration
    : 0;

  return {
    labels: ["Initial Purchase", "Charging", "Maintenance", "Insurance"],
    datasets: [
      {
        data: [
          evDetails.evPrice,
          chargingCostTotal,
          evDetails.maintenanceCost * customerUsage.calculationDuration || 0,
          evDetails.insuranceCost * customerUsage.calculationDuration || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };
};

const createLineChartData = ({
  iceDetails,
  evDetails,
  customerUsage,
}: any) => ({
  labels: Array.from(
    { length: customerUsage.calculationDuration },
    (_, i) => i + 1
  ),
  datasets: [
    {
      label: "ICE Total Cost",
      data: Array.from({ length: customerUsage.calculationDuration }, (_, i) =>
        calculateTotalCost(iceDetails, {
          ...customerUsage,
          calculationDuration: i + 1,
        })
      ),
      borderColor: "#FF6384",
      fill: false,
    },
    {
      label: "EV Total Cost",
      data: Array.from({ length: customerUsage.calculationDuration }, (_, i) =>
        calculateTotalCost(evDetails, {
          ...customerUsage,
          calculationDuration: i + 1,
        })
      ),
      borderColor: "#36A2EB",
      fill: false,
    },
  ],
});

// API handler
export async function calculateTCO(req: Request, res: Response) {
  const { iceDetails, evDetails, customerUsage } = req.body;

  // Basic validation
  if (!iceDetails || !evDetails || !customerUsage) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Calculate total costs
    const iceTotalCost = calculateTotalCost(iceDetails, customerUsage);
    const evTotalCost = calculateTotalCost(evDetails, customerUsage, true);

    // Generate chart data
    const icePieChartData = createICEPieChartData(iceDetails, customerUsage);
    const evPieChartData = createEVPieChartData(evDetails, customerUsage);
    const lineChartData = createLineChartData({
      iceDetails,
      evDetails,
      customerUsage,
    });

    // Respond with calculated data
    return res.status(200).json({
      iceTotalCost,
      evTotalCost,
      icePieChartData,
      evPieChartData,
      lineChartData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
