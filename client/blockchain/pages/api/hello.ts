// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Block } from '../../blockchain/Model/Block'
import { TransactionTypeEnum } from '../../blockchain/Model/Enum/enums';
import { TransactionData } from '../../blockchain/Model/TransactionData';

type Data = {
  name: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const transactionData1 = new TransactionData("Bob", TransactionTypeEnum.IN, 1);
  res.status(200).json({ name: transactionData1 })
}
