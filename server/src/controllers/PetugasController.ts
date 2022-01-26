import { getRepository } from "typeorm";
import { Controller } from "../../@types/controller";
import Petugas from "../entities/Petugas";

const petugasRepository = getRepository(Petugas);

export const getPetugas: Controller = async (_, res) => {
  const petugas = await petugasRepository.find({ relations: ["role"] });
  return res.json(petugas);
};
