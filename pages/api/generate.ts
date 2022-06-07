import type { NextApiRequest, NextApiResponse } from 'next';

import { Public } from '../../libs/public-env';
import dbConnect from '../../libs/mongo';
import UrlModel, { IUrlDoc } from '../../models/url';
import generateAlphaNumeric from '../../libs/random';
import axios from 'axios';

const MAX_ATTEMPTS = 10;
const AXIOS_TIMEOUT = 5000;

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string' || url.startsWith(Public.NEXT_PUBLIC_APP_URL)) {
    return res.status(400).send('Invalid URL');
  }

  try {
    await Promise.all([
      await dbConnect(),
      axios.get(url, { timeout: AXIOS_TIMEOUT }),
    ]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return res.status(400).send('URL connection timeout');
      } else {
        return res.status(400).send('URL connection error');
      }
    } else {
      return res.status(500).send('Database error');
    }
  }
  
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
  return res.status(500).send('Internal server error');
};

export default Handler;
