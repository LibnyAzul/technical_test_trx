import { RequestHandler } from "express";
import _ from "lodash";
import Vehicle from "../entity/vehicle";
import Tracking from "../entity/tracking";

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
  const { objectsPerPage, page, filters } = req.body;

  // Construir objeto de consulta dinámico basado en los filtros
  const query: any = {};
  if (filters && filters.length > 0) {
    filters.forEach((filter: any) => {
      switch (filter.filter) {
        case "startWith":
          // filter.field Like 'filter.value%'
          query[filter.field] = { $regex: `^${filter.value}`, $options: "i" };
          break;
        case "endWith":
          query[filter.field] = { $regex: `${filter.value}^`, $options: "i" };
          break;
        case "contains":
          query[filter.field] = {
            $regex: `.*${filter.value}.*`,
            $options: "i",
          };
          break;
        case "equals":
          query[filter.field] = filter.value;
          break;
        default:
          // Manejar filtro no reconocido
          break;
      }
    });
  }

  // Contar total de registros a partir de los filtros
  const total = await Vehicle.countDocuments(query);

  // Aplicar paginación
  const skip = (page - 1) * objectsPerPage;

  // se aplica la paginación, usando los filtros, pagina actual y los objetos por pagina
  const vehicles = await Vehicle.find(query).skip(skip).limit(objectsPerPage);

  // Calcular información de paginación
  const maxPage = Math.ceil(total / objectsPerPage);
  const previousPage = page > 1 ? page - 1 : 1;
  const nextPage = page < maxPage ? page + 1 : maxPage;

  // Respuesta
  return res.json({
    objectsPerPage,
    page,
    maxPage,
    previousPage,
    nextPage,
    total,
    filters,
    list: vehicles,
  });
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

export const getTrackigByVehicle: RequestHandler = async (req, res) => {
  try {
    // Busca el vehículo por su ID
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Obtiene la lista de IDs de trackings asociados a ese vehículo
    const trackingIds = vehicle.tracking;

    // Busca los trackings correspondientes en la base de datos
    const trackings = await Tracking.find({ _id: { $in: trackingIds } });

    // Retorna los trackings encontrados
    res.json(trackings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
