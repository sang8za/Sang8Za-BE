import { withConnection } from '../middlewares/connection';
import { PropertyQueries } from './queries';
import utils from '../modules/util';
import CONSTANTS from '../modules/constants';

import type { PropertyOption } from '../interfaces/property/PropertyOption';

const getList = (userId: number, propertyOption: PropertyOption) =>
  withConnection(async (db) => {
    const { distance = 100 } = propertyOption; // default distance is 100
    const necessaryPropertyOptions = { ...propertyOption };
    delete necessaryPropertyOptions.distance; // distance is calculated separately

    const matchPointBaseFilters = getMatchPointBaseFilters(
      necessaryPropertyOptions
    );

    const { rows: properties } = await db.query(
      PropertyQueries.QUERY_GET_RECOMMENDED_PROPERTY_LIST(
        matchPointBaseFilters
      ),
      [userId, Number(distance)]
    );
    return hydrateProperties(properties);
  });

const getMatchPointBaseFilters = (propertyOption: PropertyOption): string => {
  let baseFilters: string = '';
  if (Object.keys(propertyOption).length === 0) return baseFilters;

  for (const [typeString, value] of Object.entries(propertyOption)) {
    const type = // map type string from the request and option_id from the database
      CONSTANTS.OPTION_MAP[typeString as keyof typeof CONSTANTS.OPTION_MAP];

    if (CONSTANTS.RANGE_OPTIONS.includes(typeString)) {
      // range option uses BETWEEN
      const [min, max] = value.sort((a: number, b: number) => a - b);
      baseFilters += `WHEN po.option_id = ${type} AND po.value::INT BETWEEN ${min} AND ${max} THEN 1\n`;
      continue;
    }

    baseFilters += `WHEN po.option_id = ${type} AND po.value = '${value}' THEN 1\n`;
  }

  return baseFilters;
};

const hydrateProperties = (properties: any[]) => {
  return withConnection(async (db) => {
    const propertyIds = properties.map(({ id }: { id: number }) => id);
    const [{ rows: images }, { rows: options }] = await Promise.all([
      db.query(PropertyQueries.QUERY_GET_PROPERTY_IMAGES, [propertyIds]),
      db.query(PropertyQueries.QUERY_GET_PROPERTY_OPTIONS, [propertyIds]),
    ]);

    const imageMap = utils.buildMap(images);
    const optionMap = options.reduce((acc, { id, name, value }) => {
      acc[id] = acc[id] || {};

      if (['true', 'false'].includes(value)) {
        acc[id][name] = value === 'true';
      } else if (!isNaN(Number(value))) {
        acc[id][name] = Number(value);
      } else {
        acc[id][name] = value;
      }

      return acc;
    }, {});

    return properties.map((property: any) => ({
      ...property,
      images: imageMap[property.id].images || [],
      options: optionMap[property.id],
    }));
  });
};

export default { getList, hydrateProperties };
