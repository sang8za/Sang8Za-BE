import { Request, Response } from 'express';
import { asyncWrapper } from '..//middlewares/async';
import httpStatusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { ContractService } from '../services';

const createContract = asyncWrapper(async (req: Request, res: Response) => {
  const { userId, matchId } = req.body;

  try {
    const contract = await ContractService.createContract(
      Number(userId),
      Number(matchId)
    );

    return res
      .status(httpStatusCode.CREATED)
      .send(
        util.success(httpStatusCode.CREATED, message.CONTRACT_CREATED, contract)
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

export default { createContract };
