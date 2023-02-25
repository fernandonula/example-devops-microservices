import ShiftsDAO from "../dao/shiftsDAO";

class ShiftsService {
  cache: any;
  shiftsDAO: ShiftsDAO;

  constructor() {
    this.cache = {};
    this.shiftsDAO = new ShiftsDAO();
  }

  async all() {
    return await this.shiftsDAO.getAll();
  }
}

// singleton for one time:
export default new ShiftsService();
