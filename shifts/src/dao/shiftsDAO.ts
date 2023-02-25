import Shifts from "../models/Shifts";

class ShiftsDAO {
  constructor() {}

  async getAll() {
    return await Shifts.find({}).lean();
  }
}

export default ShiftsDAO;
