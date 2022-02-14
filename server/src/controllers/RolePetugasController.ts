import { getRepository, ILike } from "typeorm";
import type { Controller } from "../../@types/express";
import RolePetugas from "../entities/RolePetugas";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validateRole } from "../utils/validation";

const roleRepository = getRepository(RolePetugas);

export const getRoleById: Controller = async (req, res) => {
    const role = await roleRepository.findOne(req.params.id);

    return res.json(role);
};

export const getRole: Controller = async (req, res) => {
    const { search } = req.query;

    const role = await roleRepository.find({
        where: {
            nama_role: ILike(`%${search}%`),
        },
        order: { id_role: "ASC" },
    });

    return res.json(role);
};

export const createRole: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateRole(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const newRole = roleRepository.create(req.body);
    const savedRole = await roleRepository.save(newRole);

    return res.json(savedRole);
};

export const updateRole: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateRole(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const role = await roleRepository.findOne(req.params.id);
    if (!role) return handleError("notFound", res);

    await roleRepository.update(role, req.body);

    return res.status(204).json();
};

export const deleteRole: Controller = async (req, res) => {
    const role = await roleRepository.findOne(req.params.id);
    if (!role) return handleError("notFound", res);

    const deletedRole = await roleRepository.delete(req.params.id);

    return res.json(deletedRole);
};
