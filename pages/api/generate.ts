import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../libs/mongo';
import UrlModel, { IUrlDoc } from '../../models/url';
import generateAlphaNumeric from '../../libs/random';

const MAX_ATTEMPTS = 10;

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('Bad request');
  }
  
  await dbConnect();
  
  const urlDoc = await UrlModel.findOne<IUrlDoc>({ target: url });
  if (urlDoc) return res.json({ code: urlDoc.code });

  for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
    const code = generateAlphaNumeric(8 + i);
    const newUrlDoc = new UrlModel({
      code,
      target: url,
    });
    try {
      await newUrlDoc.save();
      return res.json({ code });
    } catch (error) {
      // duplicate code (or url, which implies race condition)
    }
  }
  return res.json({ code: null });
};

export default Handler;
