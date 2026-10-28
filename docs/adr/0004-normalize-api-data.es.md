# 4. Normalizar los datos del API en un único mapper

[English](0004-normalize-api-data.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

Al analizar los 100 productos reales se vio que los datos del API no se pueden pintar tal como llegan:

- `price` es un string, vacío en 6 productos.
- Muchos campos son unas veces string y otras array (`primaryCamera` 69/31, `os`, `cpu`, `ram`…); los arrays son un
  string separado por comas que el API ha partido (`["Deca-core (2x2.3 GHz Cortex-A72", "4x1.9 GHz …)"]`).
- Los valores ausentes llegan como `""` o `"-"`, nunca `null`.
- `displayResolution` y `displaySize` vienen cruzados en los 100 productos.
- Claves con erratas: `dimentions`, `secondaryCmera`.
- El peso es un número de gramos sin unidad; dos productos tienen un almacenamiento en blanco (`" "`); los nombres de
  color son texto libre.
- Un id inexistente responde 500, no 404.

## Decisión

- Los componentes nunca leen tipos del API. `shared/domain/productMapper.ts` los convierte en `ProductSummary` /
  `ProductDetail`: arrays unidos con ", " (que recupera la frase original), `""`/`"-"` → ausente ("No disponible" en
  la interfaz), precio formateado con `Intl` o null ("Precio no disponible", nunca "€" ni NaN), resolución tomada del
  campo que casa con `W x H pixels`, cámaras como líneas "Principal / Frontal", " g" añadido a los pesos sin unidad,
  opciones en blanco con el nombre "Sin especificar".
- Las claves con erratas se mapean de forma explícita y están tipadas en `shared/api/types.ts`; no se deduce ningún nombre
  del PDF.
- Las muestras de color salen de palabras de color en el nombre ("Titanium Gray" → gris, "Black/White" → bicolor);
  los nombres sin color ("Ferrari edition") muestran solo el nombre.
- El mensaje de error del detalle cubre "no disponible" y "el servidor no responde", porque un 500 puede ser ambas.

## Consecuencias

- Cada regla tiene test unitario contra los fixtures reales (`src/test/fixtures`, grabados del API).
- Si el API corrigiera los campos cruzados, la regla de la resolución seguiría eligiendo el correcto.
