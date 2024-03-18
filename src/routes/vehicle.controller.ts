import { RequestHandler } from "express";
import _ from "lodash";
import Vehicle from "./vehicle";

/**
 * Valida los campos requeridos y únicos para un vehículo.
 * @param req Los datos de la solicitud que contienen los campos del vehículo.
 * @param id El ID del vehículo (puede ser una cadena vacía si se está creando un nuevo vehículo).
 * @returns Un objeto con un indicador de validez y un mensaje opcional de error.
 */
const validateRequiredFields = async (req: any, id: string) => {
  // Lista de campos requeridos para un vehículo
  const requiredFields = [
    "plate",
    "economicNumber",
    "vim",
    "seats",
    "insurance",
    "insuranceNumber",
    "brand",
    "model",
    "year",
    "color",
  ];

  // Verificar si los campos requeridos están presentes y no son nulos ni vacíos
  for (const field of requiredFields) {
    if (!req[field] || _.isNil(req[field]) || req[field] === "") {
      return { valid: false, message: `The '${field}' field is required` };
    }
  }

  // Lista de campos únicos para un vehículo
  const uniqueFields = ["plate", "economicNumber", "vim", "insuranceNumber"];

  // Verificar si los campos únicos ya existen en la base de datos
  for (const field of uniqueFields) {
    // Construir la consulta para buscar un vehículo con el campo único proporcionado
    const query = { [field]: req[field] };
    if (id !== "") {
      query._id = { $ne: id };
    }
    // Buscar un vehículo con el campo único en la base de datos
    const vehicleFound = await Vehicle.findOne(query);
    if (vehicleFound) {
      return { valid: false, message: `The ${field} already exists` };
    }
  }
  // Si pasa todas las validaciones, el vehículo es válido
  return { valid: true };
};

/**
 * Crea un nuevo vehículo si los campos requeridos están presentes y válidos.
 * @param req El objeto de solicitud HTTP que contiene los datos del vehículo a crear.
 * @param res El objeto de respuesta HTTP que se utilizará para enviar la respuesta.
 * @returns Un objeto JSON que representa el vehículo recién creado o un mensaje de error si ocurre algún problema.
 */
export const createVehicle: RequestHandler = async (req, res) => {
  try {
    // Verificar si ya existe un vehículo con la placa proporcionada
    const vehicleFound = await Vehicle.findOne({ plate: req.body.plate });
    if (vehicleFound) {
      return res.status(302).json({ message: "The plate already exists" });
    }

    // Validar si los campos requeridos están presentes y no son nulos ni vacíos
    const validation = validateRequiredFields(req.body, "");
    if (!(await validation).valid) {
      return res.status(400).json({ message: (await validation).message });
    }

    // Crear el vehículo si todos los campos requeridos están presentes y válidos
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.json(savedVehicle);
  } catch (error: any) {
    // Manejar cualquier error que ocurra durante la creación del vehículo
    res
      .status(500)
      .json({ message: "Error creating vehicle", error: error.message });
  }
};

/**
 * Obtiene una lista de todos los vehículos almacenados en la base de datos.
 * @param req El objeto de solicitud HTTP que contiene los parámetros de la solicitud (si los hay).
 * @param res El objeto de respuesta HTTP que se utilizará para enviar la lista de vehículos.
 * @returns Un objeto JSON que contiene una lista de vehículos o un mensaje de error si ocurre algún problema.
 */
export const getVehicles: RequestHandler = async (req, res) => {
  try {
    // Obtener todos los vehículos de la base de datos
    const vehicle = await Vehicle.find();
    return res.json(vehicle);
  } catch (error: any) {
    // Manejar cualquier error que ocurra durante la obtención de la lista de vehículos
    res.status(500).json({
      message: "Error when obtaining the list of vehicles ",
      error: error.message,
    });
  }
};

/**
 * Obtiene un vehículo por su ID.
 * @param req El objeto de solicitud HTTP que contiene el ID del vehículo a buscar.
 * @param res El objeto de respuesta HTTP que se utilizará para enviar el vehículo encontrado.
 * @returns Un objeto JSON que representa el vehículo encontrado o un mensaje de error si el vehículo no está disponible.
 */
export const getVehicle: RequestHandler = async (req, res) => {
  // Buscar un vehículo por su ID en la base de datos
  const vehicleFound = await Vehicle.findById(req.params.id);
  if (!vehicleFound) {
    return res.status(204).json({ message: "vehicle not found" });
  }
  // Manejar cualquier error que ocurra durante la búsqueda del vehículo
  return res.json(vehicleFound);
};

/**
 * Elimina un vehículo por su ID, actualizando su estado 'alive' a falso.
 * @param req El objeto de solicitud HTTP que contiene el ID del vehículo a eliminar.
 * @param res El objeto de respuesta HTTP que se utilizará para enviar la confirmación de eliminación.
 * @returns Un objeto JSON que contiene el vehículo eliminado o un mensaje de error si el vehículo no está disponible.
 */
export const deleteVehicle: RequestHandler = async (req, res) => {
  // Buscar y actualizar el vehículo para establecer su estado 'alive' a falso
  const vehicleFound = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { alive: false },
    { new: true }
  );
  if (!vehicleFound) {
    return res.status(204).json({ message: "Vehicle not found" });
  }
  return res.status(200).json({ vehicleFound, message: "Vehicle Deleted" });
};

/**
 * Actualiza un vehículo existente por su ID, validando los campos requeridos y realizando la actualización.
 * @param req El objeto de solicitud HTTP que contiene los datos actualizados del vehículo y su ID.
 * @param res El objeto de respuesta HTTP que se utilizará para enviar el vehículo actualizado o mensajes de error.
 * @returns Un objeto JSON que representa el vehículo actualizado o un mensaje de error si el vehículo no se encuentra o hay problemas de validación.
 */
export const updateVehicle: RequestHandler = async (req, res) => {
  try {
    // Validar si los campos requeridos están presentes y no son nulos ni vacíos
    const validation = validateRequiredFields(req.body, req.params.id);
    if (!(await validation).valid) {
      return res.status(400).json({ message: (await validation).message });
    }

    // Realizar la busqueda del id del vehiculo
    const vehicleUpdate = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Verificar si el vehículo fue encontrado y actualizado
    if (!vehicleUpdate) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Devolver el vehículo actualizado
    res.json(vehicleUpdate);
  } catch (error: any) {
    // Manejar cualquier error que ocurra durante la actualización del vehículo
    res
      .status(500)
      .json({ message: "Error updating vehicle", error: error.message });
  }
};

/**
 * Busca vehículos en la base de datos por un campo específico y un valor de búsqueda.
 * @param req El objeto de solicitud HTTP que contiene el nombre del campo y el valor de búsqueda.
 * @param res El objeto de respuesta HTTP que se utilizará para enviar los vehículos encontrados o mensajes de error.
 * @returns Un objeto JSON que contiene una lista de vehículos encontrados o un mensaje de error si no se encuentran vehículos o hay problemas de búsqueda.
 */
export const searchVehicleByField: RequestHandler = async (req, res) => {
  try {
    const fieldName = req.params.fieldName; // Nombre del campo por el que se desea buscar
    const searchValue = req.params.searchValue; // Valor a buscar en el campo

    // Realizar la búsqueda en la base de datos utilizando el método find
    const vehicles = await Vehicle.find({ [fieldName]: searchValue });

    // Si se encontraron vehículos, devolverlos en la respuesta
    if (vehicles.length > 0) {
      return res.json({ vehicles });
    } else {
      return res.status(404).json({ message: "No vehicles found" });
    }
  } catch (error: any) {
    // Manejar cualquier error que ocurra durante la búsqueda
    return res
      .status(500)
      .json({ message: "Error searching vehicles", error: error.message });
  }
};
