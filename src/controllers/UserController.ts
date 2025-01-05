import { Request, Response } from 'express';
import { asyncWrapper } from '..//middlewares/async';
import httpStatusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { UserService } from '../services';

const getUser = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(Number(id));

    if (!user)
      return res
        .status(httpStatusCode.NOT_FOUND)
        .send(util.fail(httpStatusCode.NOT_FOUND, message.NOT_FOUND));

    return res
      .status(httpStatusCode.OK)
      .send(util.success(httpStatusCode.OK, message.SUCCESS, user));
  } catch (error) {
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

export default { getUser };
