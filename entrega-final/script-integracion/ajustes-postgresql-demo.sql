-- Aplicar solo en la base de demostración después de avances 1 y 2.
ALTER TABLE Staff ADD COLUMN IF NOT EXISTS usuario VARCHAR(50);
ALTER TABLE Staff ADD COLUMN IF NOT EXISTS contrasenia VARCHAR(255);
ALTER TABLE Espectador ADD COLUMN IF NOT EXISTS usuario VARCHAR(50);
ALTER TABLE Espectador ADD COLUMN IF NOT EXISTS contrasenia VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS staff_usuario_demo_unico ON Staff (LOWER(usuario));
CREATE UNIQUE INDEX IF NOT EXISTS espectador_usuario_demo_unico ON Espectador (LOWER(usuario));

-- La cartelera solo lista fechas actuales y futuras.
INSERT INTO Funcion (id_pelicula, id_sala, fecha, hora_inicio, hora_fin)
SELECT 1, 1, CURRENT_DATE + 1, TIME '18:00', TIME '20:00'
WHERE NOT EXISTS (
    SELECT 1 FROM Funcion WHERE id_pelicula = 1 AND fecha >= CURRENT_DATE
);
