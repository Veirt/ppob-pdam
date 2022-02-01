import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getRepository } from "typeorm";
import Petugas from "../entities/Petugas";

const petugasRepository = getRepository(Petugas);

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const petugas = await petugasRepository.findOne(
                { username },
                {
                    select: ["id_petugas", "username", "password", "role"],
                    relations: ["role"],
                }
            );

            if (!petugas) {
                throw Error(`Username '${username}' tidak ditemukan.`);
            }

            if (!(await petugas.verifyPassword(password))) {
                throw Error("Password salah");
            }

            return done(null, petugas);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    return done(null, (user as Petugas).id_petugas);
});

passport.deserializeUser(async (idPetugas, done) => {
    try {
        const petugas = await petugasRepository.findOne(
            {
                id_petugas: idPetugas as number,
            },
            { relations: ["role"] }
        );

        if (!petugas) {
            throw Error("Petugas tidak ditemukan");
        }

        return done(null, petugas);
    } catch (err) {
        console.error(`Unexpected error when deserializing user: ${err}`);
        return done(err);
    }
});
