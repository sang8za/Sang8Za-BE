import { Request, Response } from 'express';
import { asyncWrapper } from '..//middlewares/async';
import httpStatusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { PropertyService } from '../services';

import type { PropertyOption } from '../interfaces/property/PropertyOption';

const getList = asyncWrapper(async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const propertyOption = req.query as unknown as PropertyOption;

  try {
    const properties = await PropertyService.getList(
      Number(userId),
      propertyOption
    );

    return res
      .status(httpStatusCode.OK)
      .send(util.success(httpStatusCode.OK, message.SUCCESS, properties));
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          httpStatusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
});

export default { getList };
