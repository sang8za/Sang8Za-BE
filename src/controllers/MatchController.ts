import { Request, Response } from 'express';
import { asyncWrapper } from '..//middlewares/async';
import httpStatusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { MatchService } from '../services';

const createTenantSwipe = asyncWrapper(async (req: Request, res: Response) => {
  const { userId, propertyId, isPositive } = req.body;
  try {
    const { row, isMatched } = await MatchService.createTenantSwipe(
      userId,
      propertyId,
      isPositive
    );

    const createdMessage = isMatched
      ? message.MATCH_CREATED
      : message.SWIPE_CREATED;
    return res
      .status(httpStatusCode.CREATED)
      .send(
        util.success(httpStatusCode.CREATED, createdMessage, {
          ...row,
          isMatched,
        })
      );
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

export default { createTenantSwipe };
