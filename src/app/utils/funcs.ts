import axios from "axios";
import {
  CafeteriaMenu,
  Event,
  Room,
  LoggedUser,
  Note,
  RegisteredEmployee,
  RegistrationInfos,
  ReportCollection,
  ReportType,
  ReportWithSteroids,
  RestauMenu,
  Restau_CafeteriaItem,
  StockCategory,
  StockItem,
  StockTransaction,
  Task,
  Client,
  ReservedRoom,
  Reservation,
  SportHall,
  Coach,
  SportHallClient,
  EventStage,
  EventInvited,
  EventOrganiser,
  Stat,
  VerificationCode,
  EmployeeProfileType,
  Dash,
  SelfUpdateEmployee,
  SelfUpdateAdmin,
  StockDashboardResult,
  ClientHistory,
  HotelInfos,
  Stock,
  Restaurant,
  Cafeteria,
  LostObj,
  PendingClients,
  StockBudget,
  CleaningType,
} from "../types/types";
import {
  DaysOfWeek,
  Departements,
  EmployeeState,
  Restau_CafeteriaItemCategories,
  RoomType,
  UserPermission,
  UserRole,
} from "../types/constants";
import { ForgetPasswordData } from "@/app/api/auth/password/forgetPassword/types";

const mainBaseUrl = "http://104.154.75.47/api/main";
const authBaseUrl = "http://104.154.75.47/api/auth";


//AUTH
export async function signUp(user: RegistrationInfos, planName: string) {
  const fullInfos = {
    ...user,
    planName,
    dateOfBirth: new Date(user.dateOfBirth),
  };
  console.log(fullInfos);
  try {
    return await axios.post(`${authBaseUrl}/signup`, fullInfos).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function signIn(user: LoggedUser) {
  const role = user.permission === UserPermission.admin ? "admin" : "employee";
  const fullInfos = { ...user, collection: role };
  try {
    const response = await axios.post(`${authBaseUrl}/signin`, fullInfos);
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function sendForgetPasswordCode(data: ForgetPasswordData) {
  try {
    return await axios
      .post(`${authBaseUrl}/password/forgetPassword`, data)
      .then((res) => {
        return res.data.message;
      });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export async function sendVerficationCode(data: VerificationCode) {
  try {
    return await axios
      .post(`${authBaseUrl}/password/resetCode`, data)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function logOut() {
  try {
    return await axios.get(`${authBaseUrl}/logout`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

// Employee

export async function addEmployee(user: RegisteredEmployee) {
  const workingDays = (user.workingDays && user.workingDays !== "") ? (user.workingDays as DaysOfWeek).split(
    ","
  ) as Array<DaysOfWeek> : [];
  console.log(user.departement);
  const departement = (user.departement && user.departement !== "" && user.departement.length > 0) ? (user.departement as Departements)
    .split(" ")
    .join("_")
    .split(",") as Array<Departements> : [];
  const state = user.state ? (user.state as EmployeeState).split(" ").join("_") : EmployeeState.working;
  const role = (user.role && user.role !== "" && user.role.length > 0) ? (user.role as UserRole)
    .split(" ")
    .join("_")
    .split(",") as Array<UserRole> : [];

  const obj = {
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    dateOfBirth: new Date(user.dateOfBirth),
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    email: user.email,
    departement: departement,
    role: role,
    workingDays: workingDays,
    nationality: user.nationality,
    state: state,
    password: user.password,
  };
  try {
    return await axios.post(`${mainBaseUrl}/employee`, obj).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getAllEmployees(
  token: string
): Promise<{ Employees: RegisteredEmployee[] }> {
  const employees = await fetch(`${mainBaseUrl}/employee`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return employees.json();
}

export async function deleteEmployee(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/employee/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
}

export async function updateEmployee(id: string, user: RegisteredEmployee) {
  const workingDays = (user.workingDays as DaysOfWeek).split(
    ","
  ) as Array<DaysOfWeek>;
  const departement = (user.departement as Departements).split(",");
  const state = (user.state as EmployeeState).split(" ").join("_");
  const role = (user.role as UserRole)
    .split(" ")
    .join("_")
    .split(",") as Array<UserRole>;
  const obj = {
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    dateOfBirth: new Date(user.dateOfBirth),
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    email: user.email,
    departement: departement,
    role: role,
    workingDays: workingDays,
    nationality: user.nationality,
    state: state,
    password: user.password,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/employee/${id}`, obj)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Cafeteria


export async function addRestaurant(stock: Restaurant): Promise<string> {
  const restaurantEmployee = stock.restaurantEmployee
    ? (stock.restaurantEmployee as string)
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => ({
        employeeId: id.trim(),
      }))
    : [];

  const fullInfos = {
    name: stock.name,
    description: stock.description,
    location: stock.location,
    restaurantEmployee,
  };

  try {
    const response = await axios.post(`${mainBaseUrl}/food/restaurant/restaurant`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'An error occurred');
  };
};


export async function updateRestaurant(stock: Restaurant, id: string): Promise<string> {
  const restaurantEmployees = stock.restaurantEmployee
    ? (stock.restaurantEmployee as string)
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => ({
        employeeId: id.trim(),
      }))
    : [];

  const fullInfos = {
    name: stock.name,
    description: stock.description,
    location: stock.location,
    restaurantEmployees,
  };

  try {
    const response = await axios.patch(`${mainBaseUrl}/food/restaurant/restaurant/${id}`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'An error occurred');
  };
};

export async function addCafeteria(stock: Cafeteria): Promise<string> {
  const cafeteriaEmployee = stock.cafeteriaEmployee
    ? (stock.cafeteriaEmployee as string)
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => ({
        employeeId: id.trim(),
      }))
    : [];

  const fullInfos = {
    name: stock.name,
    description: stock.description,
    location: stock.location,
    cafeteriaEmployee,
  };

  try {
    const response = await axios.post(`${mainBaseUrl}/food/cafeteria/cafeteria`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'An error occurred');
  };
};


export async function updateCafeteria(stock: Cafeteria, id: string): Promise<string> {
  const cafeteriaEmployees = stock.cafeteriaEmployee
    ? (stock.cafeteriaEmployee as string)
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => ({
        employeeId: id.trim(),
      }))
    : [];

  const fullInfos = {
    name: stock.name,
    description: stock.description,
    location: stock.location,
    cafeteriaEmployees,
  };

  try {
    const response = await axios.patch(`${mainBaseUrl}/food/restaurant/restaurant/${id}`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'An error occurred');
  };
};

export async function getRestauMenuItems(
  restauMenuId: string,
  restauId: string,
): Promise<{ [key: string]: Restau_CafeteriaItem[] }> {
  const menus = await axios.get(
    `${mainBaseUrl}/food/restaurant/item/${restauMenuId}`
  );
  return menus.data;
};

export async function getCafeteriaMenuItems(
  cafeteriaMenuId: string,
  cafeteriaId: string,
): Promise<{ [key: string]: Restau_CafeteriaItem[] }> {
  const menus = await axios.get(
    `${mainBaseUrl}/food/restaurant/item/${cafeteriaId}`
  );
  return menus.data;
};

export async function deleteCafeteriaMenu(cafeteriaId: string, menuId: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/food/cafeteria/menu/${cafeteriaId}/${menuId}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function deleteRestaurantMenu(restauId: string, menuId: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/food/restaurant/menu/${restauId}/${menuId}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function getAllRestaurants(): Promise<{
  Restaurants: Array<Stock>;
}> {
  const infos = await fetch(`${mainBaseUrl}/food/restaurant/restaurant/restaurantAccess`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function getAllCafeterias(): Promise<{
  Cafeterias: Array<Cafeteria>;
}> {
  const infos = await fetch(`${mainBaseUrl}/food/cafeteria/cafeteria/cafeteriaAccess`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function getRestauMenus(id: string): Promise<{
  [key: string]: RestauMenu[];
}> {
  const menus = await axios.get(`${mainBaseUrl}/food/restaurant/menu/${id}`);
  return menus.data;
};


export async function getCafeteriaMenus(id: string): Promise<{
  [key: string]: CafeteriaMenu[];
}> {
  const menus = await axios.get(`${mainBaseUrl}/food/cafeteria/menu/${id}`);
  return menus.data;
};


export async function addCafeteriaMenu(menu: CafeteriaMenu) {
  try {
    return await axios
      .post(`${mainBaseUrl}/food/cafeteria/menu`, menu)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
}

export async function updateCafeteriaMenu(menu: CafeteriaMenu, id: string) {
  try {
    return await axios
      .post(`${mainBaseUrl}/food/cafeteria/${id}`, menu)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
}

export async function addRestauMenu(menu: RestauMenu) {
  try {
    return await axios
      .post(`${mainBaseUrl}/food/restaurant/menu`, menu)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function updateRestauMenu(menu: RestauMenu, id: string) {
  try {
    return await axios
      .post(`${mainBaseUrl}/food/restaurant/${id}`, menu)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function getAllCafeteriaMenus(): Promise<{
  [key: string]: CafeteriaMenu[];
}> {
  const menus = await axios.get(`${mainBaseUrl}/food/cafeteria`);
  return menus.data;
}

export async function getAllRestauMenus(): Promise<{
  [key: string]: RestauMenu[];
}> {
  const menus = await axios.get(`${mainBaseUrl}/food/restaurant`);
  return menus.data;
};

export async function getCafeteriaMenu(
  restauMenuId: string
): Promise<{ [key: string]: CafeteriaMenu }> {
  const menus = await axios.get(`${mainBaseUrl}/food/cafeteria/`);
  return menus.data;
}

export async function getRestauMenu(): Promise<{ [key: string]: RestauMenu }> {
  const menus = await axios.get(`${mainBaseUrl}/food/restaurant/`);
  return menus.data;
}

export async function addCafeteriaMenuItem(
  item: Restau_CafeteriaItem,
  cafeteriaMenuId: string
) {
  const fullInfos = {
    ...item,
    cafeteriaMenuId: cafeteriaMenuId,
    category:
      item.category === Restau_CafeteriaItemCategories.cafe
        ? "caffee"
        : item.category,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/food/cafeteria/item`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addRestauMenuItem(
  item: Restau_CafeteriaItem,
  restauMenuId: string
) {
  const fullInfos = {
    ...item,
    restaurantMenuId: restauMenuId,
    category:
      item.category === Restau_CafeteriaItemCategories.cafe
        ? "caffee"
        : item.category,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/food/restaurant/item`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateCafeteriaMenuItem(
  item: Restau_CafeteriaItem,
  cafeteriaMenuId: string
) {
  const fullInfos = {
    ...item,
    cafeteriaMenuId: cafeteriaMenuId,
    category:
      item.category === Restau_CafeteriaItemCategories.cafe
        ? "caffee"
        : item.category,
  };
  try {
    return await axios
      .patch(
        `${mainBaseUrl}/food/cafeteria/item/${cafeteriaMenuId}/${item.id}`,
        fullInfos
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateRestauMenuItem(
  item: Restau_CafeteriaItem,
  cafeteriaMenuId: string
) {
  const fullInfos = {
    ...item,
    restaurantMenuId: cafeteriaMenuId,
    category:
      item.category === Restau_CafeteriaItemCategories.cafe
        ? "caffee"
        : item.category,
  };
  try {
    return await axios
      .patch(
        `${mainBaseUrl}/food/restaurant/item/${cafeteriaMenuId}/${item.id}`,
        fullInfos
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getAllCafeteriaMenuItems(
  cafeteriaMenuId: string
): Promise<{ [key: string]: Restau_CafeteriaItem[] }> {
  const menus = await axios.get(
    `${mainBaseUrl}/food/cafeteria/item/${cafeteriaMenuId}`
  );
  return menus.data;
}

export async function getAllRestauMenuItems(
  restauMenuId: string
): Promise<{ [key: string]: Restau_CafeteriaItem[] }> {
  const menus = await axios.get(
    `${mainBaseUrl}/food/restaurant/item/${restauMenuId}`
  );
  return menus.data;
}

export async function deleteCafeteriaMenuItem(
  cafeteriaMenuId: string,
  menuItemId: string
) {
  try {
    return await axios
      .delete(
        `${mainBaseUrl}/food/cafeteria/item/${cafeteriaMenuId}/${menuItemId}`
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function deleteRestauMenuItem(
  cafeteriaMenuId: string,
  menuItemId: string
) {
  try {
    return await axios
      .delete(
        `${mainBaseUrl}/food/restaurant/item/${cafeteriaMenuId}/${menuItemId}`
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Notes

export async function addNote(note: Note) {
  const fullInfos = {
    title: note.title,
    description: note.description,
    deadline: new Date(note.deadline),
  };
  try {
    return await axios.post(`${mainBaseUrl}/note`, fullInfos).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateNote(note: Note, id: string) {
  const fullInfos = {
    title: note.title,
    content: note.description,
    deadline: new Date(note.deadline),
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/note/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getNotes(
  token: string | undefined
): Promise<{ notes: Array<Note> }> {
  if (token === undefined) {
    const notes = await fetch(`${mainBaseUrl}/note`, { cache: "no-store" });
    return notes.json();
  } else {
    const notes = await fetch(`${mainBaseUrl}/note`, {
      cache: "no-cache",
      headers: {
        Cookie: token,
      },
    });
    return notes.json();
  }
}

export async function deleteNote(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/note/${id}`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Tasks

export async function addTask(task: Task) {
  const employeeAssignedTask = task.receivers && (task.receivers.length > 0 ? (task.receivers as string)
    .split(";")
    .filter((receivers) => receivers.trim() !== "")
    .flatMap((receivers) => {
      return receivers.split(",").map((id) => ({
        employeeId: id.trim(),
      }));
    }) : []);

  const fullInfos = {
    title: task.title,
    description: task.description,
    deadline: new Date(task.deadline),
    employeeAssignedTask,
  };

  try {
    const response = await axios.post(`${mainBaseUrl}/task`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateTask(task: Task, id: string) {
  const receivers = (task.receivers as string).split(";") as Array<string>;
  const fullInfos = {
    title: task.title,
    description: task.description,
    isDone: task.isDone,
    deadline: new Date(task.deadline),
    employeeAssignedTask: receivers.map((receiver) => {
      return {
        employeeId: receiver,
      };
    }),
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/task/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getTasks(token: string | undefined) {
  if (token === undefined) {
    const tasks = await fetch(`${mainBaseUrl}/task`, { cache: "no-store" });
    return tasks.json();
  } else {
    const tasks = await fetch(`${mainBaseUrl}/task`, {
      cache: "no-cache",
      headers: {
        Cookie: token,
      },
    });
    return tasks.json();
  }
}

export async function deleteTask(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/task/${id}`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Departements

export async function getLiteEmployees(): Promise<{
  Employees: { id: string; firstName: string }[];
}> {
  const employees = await axios.get(`${mainBaseUrl}/employee/departement`);
  return employees.data;
}

export async function getLiteEmployees2(): Promise<{
  Employees: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  }[];
}> {
  const employees = await axios.get(`${mainBaseUrl}/employee/report`);
  return employees.data;
}

export async function getCurrentEmployeeInfos(
  token: string
): Promise<{ Employee: EmployeeProfileType }> {
  const infos = await fetch(`${mainBaseUrl}/profile/employee`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return infos.json();
}

export async function getCurrentUserInfos(token: string, id: string) {
  const infos = await fetch(`${mainBaseUrl}/employee/${id}`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return infos.json();
}

export type AdminHotelInfosType = {
  Admin: {
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: string | Date;
    email: string;
    phoneNumber: string;
    gender: string;
    nationality: string;
    hotel: {
      hotelName: string;
      id: string;
      hotelAddress: string;
      country: string;
      hotelPhoneNumber: string;
      hotelEmail: string;
      cardNumber: string;
    };
  };
};

export async function getAdminHotelInfos(
  token: string
): Promise<AdminHotelInfosType> {
  const infos = await fetch(`${mainBaseUrl}/profile/admin`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return infos.json();
}

//Stock

export async function getAllStocks(): Promise<{
  Stocks: Array<Stock>;
}> {
  const infos = await fetch(`${mainBaseUrl}/stock/stock/stockAccess`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function addStock(stock: Stock): Promise<string> {
  const stockEmployee = stock.stockEmployee
    ? (stock.stockEmployee as string)
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => ({
        employeeId: id.trim(),
      }))
    : [];

  const fullInfos = {
    name: stock.name,
    description: stock.description,
    location: stock.location,
    stockEmployee,
  };

  try {
    const response = await axios.post(`${mainBaseUrl}/stock/stock`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'An error occurred');
  }
}


export async function updateStock(stock: Stock, id: string) {
  try {
    return await axios.patch(`${mainBaseUrl}/stock/stock/${id}`, stock)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function deleteStock(id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/stock/stock/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function getStockData(): Promise<StockDashboardResult> {
  const infos = await fetch(`${mainBaseUrl}/stock/centralStock`, {
    cache: "no-cache",
  });
  return infos.json();
}

//Categories

export async function addStockCategory(category: StockCategory) {
  try {
    return await axios
      .post(`${mainBaseUrl}/stock/category`, category)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getAllStockCategories(): Promise<{
  Categories: Array<StockCategory>;
}> {
  const infos = await fetch(`${mainBaseUrl}/stock/category`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getStockCategories(
  stockId: string
): Promise<{ Categories: Array<StockCategory> }> {
  try {
    const infos = await fetch(
      `${mainBaseUrl}/stock/category/stockCategories/${stockId}`,
      { cache: "no-cache" }
    );
    return infos.json();
  } catch (err: unknown) {
    return { Categories: [] };
  }
}

export async function deleteStockCategory(stockId: string, id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/stock/category/stockCategories/${stockId}/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateStockCategory(stockId: string, id: string, category: StockCategory) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/stock/category/stockCategories/${stockId}/${id}`, category)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Items

export async function addStockItem(item: StockItem) {
  const fullInfos = {
    name: item.name,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    sku: item.sku,
    unit: item.unit,
    supplierName: item.supplierName,
    supplierPhone: item.supplierPhone,
    stockId: item.stockId,
    stockCategoryId: item.category,
    minimumQuantity: Number(item.minimumQuantity),
    description: item.description,
    supplierAddress: item.supplierAddress,
    supplierEmail: item.supplierEmail,
    isNeeded: item.quantity - item.minimumQuantity < 0 ? true : false,
  };

  try {
    return await axios
      .post(`${mainBaseUrl}/stock/item`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getStockItems(
  stockId: string
): Promise<{ Items: Array<StockItem> }> {
  const infos = await fetch(
    `${mainBaseUrl}/stock/item/stockItems/${stockId}`,
    { cache: "no-cache" }
  );
  return infos.json();
}

export async function deleteStockItem(stockId: string, id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/stock/item/stockItems/${stockId}/${id}`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateStockItem(stockId: string, id: string, item: StockItem) {
  const fullInfos = {
    name: item.name,
    quantity: item.quantity || 0,
    unitPrice: Number(item.unitPrice),
    sku: item.sku,
    unit: item.unit,
    supplierName: item.supplierName,
    supplierPhone: item.supplierPhone,
    stockId: item.stockId,
    stockCategoryId: item.categoryId,
    minimumQuantity: item.minimumQuantity || 0,
    description: item.description,
    supplierAddress: item.supplierAddress,
    supplierEmail: item.supplierEmail,
    isNeeded: item.quantity - item.minimumQuantity < 0 ? true : false,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/stock/item/stockItems/${stockId}/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Transaction

export async function addTransaction(transaction: StockTransaction) {
  const fullInfos = {
    type: transaction.type,
    quantity: Number(transaction.quantity),
    stockItemId: transaction.stockItemId,
    stockId: transaction.stockId as string,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/stock/transaction`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getStockTransactions(
  stockId: string
): Promise<{ Transactions: Array<StockTransaction> }> {
  const infos = await fetch(
    `${mainBaseUrl}/stock/transaction/stockTransactions/${stockId}`,
    { cache: "no-cache" }
  );
  return infos.json();
};

export async function getStockById(
  stockId: string
): Promise<{ Stock: Stock }> {
  const infos = await fetch(
    `${mainBaseUrl}/stock/stock/${stockId}`,
    { cache: "no-cache" }
  );
  return infos.json();
}

//Budget

export async function editBudget(budgets: StockBudget[]) {
  const fullInfos = {
    budgets: budgets.map((budget) => {
      return {
        amount: budget.amount,
        budgetId: budget.id,
      };
    })
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/stock/centralStock/budget`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};



//Report

export async function addReport(report: ReportType) {
  // First split by semicolon to get different entries
  const employeeAccess = (report.receivers as string)
    .split(";")
    .filter((receivers) => receivers.trim() !== "")
    .flatMap((receivers) => {
      // Then split by comma if present
      return receivers.split(",").map((id) => ({
        employeeId: id.trim(),
      }));
    });

  const fullInfos = {
    title: report.title,
    description: report.description,
    employeeAccess,
  };

  try {
    const response = await axios.post(`${mainBaseUrl}/report`, fullInfos);
    return response.data.message;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateReport(report: ReportWithSteroids) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/report/${report.id}`, report)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getReports(
  token: string
): Promise<{ Documents: ReportCollection[] }> {
  const infos = await fetch(`${mainBaseUrl}/report/getAccessReport`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return infos.json();
}

export async function getReport(
  id: string
): Promise<{ Document: ReportWithSteroids }> {
  const infos = await fetch(`${mainBaseUrl}/report/${id}`);
  return infos.json();
};

export async function deleteReport(id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/report/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};


//Rooms

export async function addRoom(room: Room) {
  const fullInfos = {
    number: room.number,
    type: room.type,
    price: room.price,
    status: room.status.split(" ").join("_").replace(/é/g, "e"),
    floorNumber: room.floorNumber,
    description: room.description,
    outOfServiceDescription: room.outOfServiceDescription,
    capacity:
      room.type === RoomType.single
        ? 1
        : room.type === RoomType.double
          ? 2
          : room.type === RoomType.triple
            ? 3
            : 4,
  };
  try {
    return await axios.post(`${mainBaseUrl}/room`, fullInfos).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateRoom(id: string, room: Room) {
  const fullInfos = {
    number: room.number,
    type: room.type,
    price: room.price,
    status: room.status.split(" ").join("_").replace(/é/g, "e"),
    floorNumber: room.floorNumber,
    description: room.description,
    outOfServiceDescription: room.outOfServiceDescription,
    capacity:
      room.type === RoomType.single
        ? 1
        : room.type === RoomType.double
          ? 2
          : room.type === RoomType.triple
            ? 3
            : 4,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/room/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function chanegRoomStatus(isFixed: boolean, roomId: string) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/room/status/${roomId}`, isFixed)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function getAllRooms(): Promise<{ rooms: Array<ReservedRoom> }> {
  const infos = await fetch(`${mainBaseUrl}/room`, { cache: "no-store" });
  return infos.json();
}


export async function getRoom(id: string): Promise<{ room: Reservation }> {
  const infos = await fetch(`${mainBaseUrl}/room/${id}`, { cache: "no-store" });
  return infos.json();
}

export async function deleteRoom(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/room/${id}`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function changeRoomStatus(isFixed: boolean, id: string) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/room/status/${id}`, { isFixed })
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

//Clients

export async function addClient(client: Client) {
  const fullInfos = {
    ...client,
    membersNumber: Number(client.membersNumber),
    kidsNumber: Number(client.kidsNumber),
    dateOfBirth: new Date(client.dateOfBirth),
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/client/client`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateClient(id: string, client: Client) {
  const fullInfos = {
    ...client,
    membersNumber: Number(client.membersNumber),
    kidsNumber: Number(client.kidsNumber),
    dateOfBirth: new Date(client.dateOfBirth),
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/client/client/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getClients(): Promise<{
  clients: Array<
    Client & {
      reservations: Array<{
        id: string;
        startDate: Date | string;
        endDate: Date | string;
      }>;
    }
  >;
}> {
  const infos = await fetch(`${mainBaseUrl}/client/client_with_reservation`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function deleteClient(id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/client/client/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getHistory(): Promise<{
  ClientsHistorique: ClientHistory[];
}> {
  const data = await fetch(`${mainBaseUrl}/historique`);
  return data.json();
}

// Reservation

export async function addReservation(id: string, reservation: Reservation) {
  const entryDay = new Date(reservation.startDate).getTime();
  const leavingDay = new Date(reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    clientId: id,
    startDate: new Date(reservation.startDate),
    endDate: new Date(reservation.endDate),
    source: reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: reservation.roomNumber,
    roomType: reservation.roomType,
    totalPrice: reservation.totalPrice,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/client/reservation`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateReservation(
  id: string,
  reservation: Reservation,
  resId: string
) {
  const entryDay = new Date(reservation.startDate).getTime();
  const leavingDay = new Date(reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    clientId: id,
    startDate: new Date(reservation.startDate),
    endDate: new Date(reservation.endDate),
    source: reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: reservation.roomNumber,
    roomType: reservation.roomType,
    totalPrice: reservation.totalPrice,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/client/reservation/${resId}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getClientWithReservation(
  clientId: string,
  reservationId: string | undefined
): Promise<{ client: any }> {
  const infos = await fetch(
    `${mainBaseUrl}/client/client_with_reservation/${clientId}/${reservationId}`,
    {
      cache: "no-cache",
    }
  );
  return infos.json();
}

export async function deleteReservation(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/client/reservation/${id}`);
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Members

export async function addMember(client: Client, resId: string) {
  const fullInfos = {
    ...client,
    dateOfBirth: new Date(client.dateOfBirth),
    reservationId: resId,
  };
  console.log(fullInfos);
  try {
    return await axios
      .post(`${mainBaseUrl}/client/member`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

//Gym

export async function getGyms(): Promise<{
  sportFacilities: Array<SportHall>;
}> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility`, {
    cache: "no-cache",
  });
  return infos.json();
}
export async function getGym(
  id: string
): Promise<{ sportsFacility: SportHall }> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getGymCoaches(
  id: string
): Promise<{ coaches: Array<Coach> }> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility/coach/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getAllGymCoaches(id: string): Promise<{
  coaches: Array<{ employee: Coach, sportFacilityId: string }>;
  SportFacilityCoachesCount: number;
}> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility/coach/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getGymMembers(
  id: string
): Promise<{ sportsFacilitiesMember: Array<SportHallClient> }> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility/member/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function addGym(gym: SportHall) {
  const fullInfos = {
    location: gym.location,
    sportsFacilityCoaches:
      gym.coaches && gym.coaches?.length > 0
        ? (gym.coaches as string).split(",").map((coach) => {
          return {
            employeeId: coach,
          };
        })
        : [],
    openingDays:
      gym.openingDays === undefined
        ? undefined
        : ((gym.openingDays as string).split(",") as DaysOfWeek[]),
    name: gym.name,
    description: gym.description,
    type: gym.type,
    capacity: Number(gym.capacity),
    price: gym.price === 0 ? undefined : Number(gym.price),
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/sports_facility`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function deleteGym(gymId: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/sports_facility/${gymId}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateGym(gym: SportHall, id: string) {
  const fullInfos = {
    location: gym.location,
    sportsFacilityCoaches: (gym.coaches && gym.coaches.length > 0) ? (gym.coaches as string).split(",").map((coach) => {
      return {
        employeeId: coach,
      };
    }) : [],
    openingDays:
      gym.openingDays === undefined
        ? undefined
        : ((gym.openingDays as string).split(",") as DaysOfWeek[]),
    name: gym.name,
    description: gym.description,
    type: gym.type,
    capacity: Number(gym.capacity),
    price: gym.price === 0 ? undefined : gym.price,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/sports_facility/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addGymMember(member: SportHallClient, id: string) {
  const fullInfos = {
    ...member,
    sportsFacilityId: id,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/sports_facility/member`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateGymMember(member: SportHallClient, id: string) {
  const fullInfos = {
    ...member,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/sports_facility/member/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getGymLiteCoaches(): Promise<{
  coaches: Array<{ id: string; firstName: string; lastName: string }>;
}> {
  const infos = await fetch(`${mainBaseUrl}/sports_facility/coach`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function deleteGymClient(memberId: string, gymId: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/sports_facility/member/${gymId}/${memberId}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

////Events

export async function getEvents() {
  const infos = await fetch(`${mainBaseUrl}/event/event`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function addEvent(event: Event) {
  const fullInfos = {
    name: event.name,
    leader: event.leader,
    bankCard: event.bankCard,
    description: event.description,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    guests: Number(event.guests),
    eventType: event.eventType,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/event/event`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateEvent(event: Event, id: string) {
  const fullInfos = {
    name: event.name,
    leader: event.leader,
    bankCard: event.bankCard,
    description: event.description,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    guests: event.guests,
    eventType: event.eventType,
  };
  try {
    return await axios
      .patch(`${mainBaseUrl}/event/event/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getEvent(id: string): Promise<{ Event: Event }> {
  const infos = await fetch(`${mainBaseUrl}/event/event/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function deleteEvent(eventId: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/event/event/${eventId}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function addEventStage(stage: EventStage) {
  try {
    return await axios
      .post(`${mainBaseUrl}/event/seance`, stage)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getEventStages(
  id: string
): Promise<{ EventSeances: EventStage[] }> {
  const infos = await fetch(`${mainBaseUrl}/event/seance/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function deleteEventStage(eventId: string, id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/event/seance/${eventId}/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function deleteHotelEventStage(id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/calendar/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};
export async function deleteHouseKeepingPlanification(id: string) {
  try {
    return await axios
      .delete(`${mainBaseUrl}/housekeeping/planification/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function addCleaningDate(cleaningInfos : CleaningType ) {

  const fullInfos = {
    title : cleaningInfos.title,
    description : cleaningInfos.description,
    start :new Date( cleaningInfos.date),
    end : new Date(cleaningInfos.date),
  };

  try {
    return await axios
      .post(`${mainBaseUrl}/housekeeping/planification`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function addEventGuest(guest: EventInvited) {
  try {
    return await axios
      .post(`${mainBaseUrl}/event/attendue`, {
        ...guest,
        dateOfBirth: new Date(guest.dateOfBirth),
      })
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function deleteEventGuest(
  eventId: string,
  id: string
) {
  /////////NEED TO CHECK
  try {
    return await axios
      .delete(`${mainBaseUrl}/event/attendue/${eventId}/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export async function updateEventGuest(
  guest: EventInvited,
  eventId: string,
  id: string
) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/event/attendue/${eventId}/${id}`, {
        ...guest,
        dateOfBirth: new Date(guest.dateOfBirth),
      })
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addEventOrganiser(organiser: EventOrganiser) {
  try {
    return await axios
      .post(`${mainBaseUrl}/event/attendue`, {
        ...organiser,
        dateOfBirth: new Date(organiser.dateOfBirth),
      })
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function updateEventOrganiser(
  organiser: EventInvited,
  eventId: string,
  id: string
) {
  try {
    return await axios
      .patch(`${mainBaseUrl}/event/attendue/${eventId}/${id}`, {
        ...organiser,
        dateOfBirth: new Date(organiser.dateOfBirth),
      })
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function getEventGuests(
  id: string
): Promise<{ Attendues: EventInvited[] }> {
  const infos = await fetch(`${mainBaseUrl}/event/attendue/${id}`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getEventGuestWithReservation(
  eventId: string,
  clientId: string
): Promise<{ Attendue: any }> {
  const infos = await fetch(
    `${mainBaseUrl}/event/attendue/${eventId}/${clientId}`,
    {
      cache: "no-cache",
    }
  );
  return infos.json();
}

export async function addEventGuestReservation(
  id: string,
  eventId: string,
  reservation: Reservation
) {
  const entryDay = new Date(reservation.startDate).getTime();
  const leavingDay = new Date(reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    eventId: eventId,
    attendueId: id,
    startDate: new Date(reservation.startDate),
    endDate: new Date(reservation.endDate),
    source: reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: reservation.roomNumber,
    roomType: reservation.roomType,
    totalPrice: reservation.totalPrice,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/event/reservation`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function updateEventGuestReservation(
  id: string,
  eventId: string,
  resId: string,
  reservation: Reservation
) {
  const entryDay = new Date(reservation.startDate).getTime();
  const leavingDay = new Date(reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    eventId: eventId,
    attendueId: id,
    startDate: new Date(reservation.startDate),
    endDate: new Date(reservation.endDate),
    source: reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: reservation.roomNumber,
    roomType: reservation.roomType,
    totalPrice: reservation.totalPrice,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/event/reservation/${id}`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addEventMember(
  member: SportHallClient,
  eventId: string,
  reservationId: string
) {
  const fullInfos = {
    ...member,
    eventId: eventId,
    reservationId: reservationId,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/event/member`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getStatistics(
  token: string
): Promise<{ Statistics: Stat[] }> {
  const stat = await fetch(`${mainBaseUrl}/statistics`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return stat.json();
}

export async function getReservation(id: string) : Promise<{reservation : Reservation}> {
  const stat = await fetch(`${mainBaseUrl}/client/reservation/${id}`, {
    cache: "no-cache",
  });
  return stat.json();
}

export async function addClientWithReservation(data: {
  client: Client;
  reservation: Reservation;
}) {
  const entryDay = new Date(data.reservation.startDate).getTime();
  const leavingDay = new Date(data.reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    ...data.client,
    membersNumber: Number(data.client.membersNumber),
    kidsNumber: Number(data.client.kidsNumber),
    dateOfBirth: new Date(data.client.dateOfBirth),
    startDate: new Date(data.reservation.startDate),
    endDate: new Date(data.reservation.endDate),
    source: data.reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: data.reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: data.reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: data.reservation.roomNumber,
    roomType: data.reservation.roomType,
    totalPrice: data.reservation.totalPrice,
  };
  try {
    return await axios
      .post(`${mainBaseUrl}/client/client_with_reservation`, fullInfos)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}
export async function updateClientWithReservation(
  data: { client: Client; reservation: Reservation },
  clientId: string,
  resId: string
) {
  const entryDay = new Date(data.reservation.startDate).getTime();
  const leavingDay = new Date(data.reservation.endDate).getTime();
  const dayDifference = (leavingDay - entryDay) / (1000 * 3600 * 24);
  const fullInfos = {
    ...data.client,
    membersNumber: Number(data.client.membersNumber),
    kidsNumber: Number(data.client.kidsNumber),
    dateOfBirth: new Date(data.client.dateOfBirth),
    startDate: new Date(data.reservation.startDate),
    endDate: new Date(data.reservation.endDate),
    source: data.reservation.source?.split(" ").join("_").replace(/é/g, "e"),
    state: data.reservation.state?.split(" ").join("_").replace(/é/g, "e"),
    discoveryChannel: data.reservation.discoverChannel
      ?.split(" ")
      .join("_")
      .replace(/é/g, "e"),
    totalDays: dayDifference,
    roomNumber: data.reservation.roomNumber,
    roomType: data.reservation.roomType,
    totalPrice: data.reservation.totalPrice,
  };
  try {
    return await axios
      .patch(
        `${mainBaseUrl}/client/client_with_reservation/${clientId}/${resId}`,
        fullInfos
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addCalendarEventStage(stage: EventStage) {
  try {
    return await axios.post(`${mainBaseUrl}/calendar`, stage).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function deleteCalendarEventStage(id: string) {
  try {
    return await axios.delete(`${mainBaseUrl}/calendar/${id}`).then((res) => {
      return res.data.message;
    });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function getCalendarEventStages(): Promise<{
  Calendars: EventStage[];
}> {
  const infos = await fetch(`${mainBaseUrl}/calendar`, {
    cache: "no-cache",
  });
  return infos.json();
}

export async function getDashboardData(token: string): Promise<Dash> {
  const infos = await fetch(`${mainBaseUrl}/dashboard`, {
    cache: "no-cache",
    headers: {
      Cookie: token,
    },
  });
  return infos.json();
}

export async function updateSelfEmployee(employee: SelfUpdateEmployee) {
  const employeeState = (employee.state as EmployeeState).split(" ").join("_");
  const employeeDateOfBirth = employee.dateOfBirth
    ? new Date(employee.dateOfBirth)
    : new Date();


  try {
    return await axios.patch(`${mainBaseUrl}/profile/employee`, {
      ...employee,
      state: employeeState,
      dateOfBirth: employeeDateOfBirth,
    }).then((res) => { return res.data.message });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function updateSelfAdmin(admin: SelfUpdateAdmin) {

  try {
    return await axios.patch(`${mainBaseUrl}/profile/admin`, admin).then((res) => { return res.data.message });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function getHotelForBill(): Promise<{ Hotel: HotelInfos }> {
  const infos = await fetch(`${mainBaseUrl}/bill`, {
    cache: "no-cache",
  });
  return infos.json();
};



export async function addLostObj(obj: LostObj) {
  try {
    return await axios
      .post(
        `${mainBaseUrl}/housekeeping/lostObject`, obj
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function updateLostObj(obj: LostObj, id: string) {
  try {
    return await axios
      .patch(
        `${mainBaseUrl}/housekeeping/lostObject/${id}`, obj
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function deleteLostObj(id: string) {
  try {
    return await axios
      .delete(
        `${mainBaseUrl}/housekeeping/lostObject/${id}`)
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export async function getHouseKeepingPlanifications(): Promise<{ HouseKeepingPlanifications: EventStage[] }> {
  const infos = await fetch(`${mainBaseUrl}/housekeeping/planification`, {
    cache: "no-cache",
  });
  return infos.json();
};


export async function getLostObjs(): Promise<{ LostObjects: LostObj[] }> {
  const infos = await fetch(`${mainBaseUrl}/housekeeping/lostObject`, {
    cache: "no-cache",
  });
  return infos.json();
};


export async function getWaitingList(): Promise<{ pendingClients: PendingClients[] }> {
  const infos = await fetch(`${mainBaseUrl}/client/pendingClients`, {
    cache: "no-cache",
  });
  return infos.json();
};


export async function updateReservationState(clientId: string, reservationId: string) {
  try {
    return await axios
      .patch(
        `${mainBaseUrl}/client/pendingClients/${clientId}/${reservationId}`
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};


export async function deletePendingReservation(clientId: string, reservationId: string) {
  try {
    return await axios
      .delete(
        `${mainBaseUrl}/client/pendingClients/${clientId}/${reservationId}`
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};

export async function getHouseKeepingEmployees(): Promise<{ Employees: RegisteredEmployee[] }> {
  const infos = await fetch(`${mainBaseUrl}/housekeeping`, {
    cache: "no-cache",
  });
  return infos.json();
};

export async function addHousekeepingPlanification(stage: EventStage) {
  try {
    return await axios
      .post(
        `${mainBaseUrl}/housekeeping/planification`, stage
      )
      .then((res) => {
        return res.data.message;
      });
  } catch (err: any) {
    throw new Error(err.response.data.message);
  };
};