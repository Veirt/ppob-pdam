import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import RolePetugas from "../entities/RolePetugas";
import { validateRole } from "../utils/validation";

const roleRepository = getRepository(RolePetugas);

export const getRoleById: Controller = async (req, res) => {
    const role = await roleRepository.findOne(req.params.id);
    return res.json(role);
};

export const getRole: Controller = async (_, res) => {
    const role = await roleRepository.find();
    return res.json(role);
};

export const createRole: Controller = async (req, res) => {
    const validationResult = await validateRole(req.body);
    if (validationResult.length > 0) return res.json(validationResult);

    const newRole = roleRepository.create(req.body);
    await roleRepository.save(newRole);

    return res.json({ msg: "Success" });
};

export const updateRole: Controller = async (req, res) => {
    const validationResult = await validateRole(req.body, req.params.id);
    if (validationResult.length > 0) return res.json(validationResult);

    const role = await roleRepository.findOne(req.params.id);

    if (!role) {
        return res.status(404).json();
    }

    await roleRepository.update(role, req.body);

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deleteRole: Controller = async (req, res) => {
    const role = await roleRepository.findOne(req.params.id);

    if (!role) {
        return res.status(404).json();
    }

    await roleRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};
