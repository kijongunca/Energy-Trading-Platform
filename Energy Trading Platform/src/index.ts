class EnergyTrade {
    id: string;
    sellerId: string;
    buyerId: string;
    amount: number; // in kWh
    pricePerUnit: number;
    status: string; // e.g., "pending", "completed"
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  const energyTradesStorage = StableBTreeMap<string, EnergyTrade>(0);
  
  app.post("/energy-trades", (req, res) => {
    const trade: EnergyTrade = {
      id: uuidv4(),
      createdAt: getCurrentDate(),
      status: "pending",
      ...req.body,
    };
    energyTradesStorage.insert(trade.id, trade);
    res.json(trade);
  });
  
  app.put("/energy-trades/:id", (req, res) => {
    const tradeId = req.params.id;
    const tradeOpt = energyTradesStorage.get(tradeId);
    if (!tradeOpt) {
      res.status(400).send(`Trade with id=${tradeId} not found`);
    } else {
      const updatedTrade = {
        ...tradeOpt,
        ...req.body,
        updatedAt: getCurrentDate(),
      };
      energyTradesStorage.insert(tradeId, updatedTrade);
      res.json(updatedTrade);
    }
  });
  